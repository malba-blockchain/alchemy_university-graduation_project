// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


interface USDCToken {
    function transfer(address dst, uint wad) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
    function balanceOf(address guy) external view returns (uint);
    function approve(address dst, uint wad) external returns (bool);
}

contract TokenMVP is ERC20, Pausable, Ownable {
    /*
    External libraries parameters
    */
    USDCToken public usdcToken;
    
    /*
    Parameters definition
    */
    bytes32 public campaignID;

    uint256 public investmentGoal;

    uint256 public currentlyInvestedFunds;

    uint256 public repayedDebtAmount;

    uint256 public numberOfInvestors;

    mapping(uint256=> address) public indexOfInvestorAddresses;

    mapping(address=> uint256) public balanceOfInvestedFunds;

    mapping(address=> uint256) public balanceOfRepayedFunds;

    uint32 public interestRate;

    enum FrequencyTerms {MONTHLY, BIMONTHLY, QUARTERLY}

    FrequencyTerms public paymentFrequency;

    uint32 public totalRepayments;

    uint32 public repaymentGracePeriod;

    uint256 public termStartDate;

    uint256 public loanMaturityDate;

    uint256 public campaignStartDate;

    uint256 public campaignEndDate;

    string public industry;

    string public category;

    uint32 public votesRequiredforMilestoneValidation;

    enum CampaignPhase {NEW_CAMPAIGN, PAUSED, IN_FUNDING, FUNDED, IN_FUNDING_USAGE, IN_REPAYMENT, ABORTED}

    CampaignPhase public currentPhase;


    /*
     Events definition
    */

    event CampaignCreated(address indexed _from, bytes32 campaignID, uint32 _interestRate, FrequencyTerms _paymentFrequency, uint32 _totalRepayments, uint32 _repaymentGracePeriod, string  _industry, string  _category);

    event FundingStarted(bytes32 indexed campaignID, uint256 campaignStartDate, uint256 campaignEndDate);

    event InvestmentDeposited(address indexed _from, uint256 _amount,  uint256 _currentlyInvestedFunds);

    event CampaignFunded(bytes32 indexed campaignID, uint256 termStartDate, uint256 loanMaturityDate);

    event TokensDropped(bytes32 indexed campaignID, uint256 totalSupply);

    event FundsWithdrawn(bytes32 indexed campaignID, address indexed owner, uint256 _amount);

    event DebtRepayed(bytes32 indexed campaignID, uint256 _amount,  uint256 _repayedDebtAmount);

    event PaymentWithdrawn(bytes32 indexed campaignID, address indexed sender, uint256 _amount);

    event CampaignAborted(bytes32 indexed campaignID);

    event InvestmentRetaken(bytes32 indexed campaignID, address indexed investor, uint256 _amount);

    /*
     Constructor definition
    */

    constructor(uint256 _investmentGoal, uint32 _interestRate, FrequencyTerms _paymentFrequency, 
        uint32 _totalRepayments, uint32 _repaymentGracePeriodDays, string memory _industry, 
        string memory _category, address _usdcTokenAddress) ERC20("TokenMVP", "TMVP") {
        
        /*
        External libraries parameters
        */

        //USDC token in ethereum mainnet address 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
        usdcToken = USDCToken(_usdcTokenAddress);
        
        /*
        Add value checks to each parameter
        */
        require(_investmentGoal>=30000 && _investmentGoal<=1000000, "Investment goal must be greater than 30K USD and less than 1M USD");
        investmentGoal = _investmentGoal;

        require(_interestRate>=5 && _interestRate<=60, "Interest rate must be greater than 5% and less than 60%");
        interestRate = _interestRate;

        //The enum data type doesnt require parameter validation
        paymentFrequency = _paymentFrequency;

        require(_repaymentGracePeriodDays>=0 && _repaymentGracePeriodDays<=90 , "Repayment grace period must be between 0 and 90 days");
        repaymentGracePeriod = _repaymentGracePeriodDays;

        require(_totalRepayments>=4 && _totalRepayments<=48, "Total number of repayments must be at least 4 and less than 48");
        totalRepayments = _totalRepayments;

        require( bytes(_industry).length>0 , "The industry parameter can not be empty");
        industry = _industry;

        require( bytes(_category).length>0 , "The category parameter can not be empty");
        category = _category;

        /*
        Update other parameters
        */

        //Create the ID of the campaign based on the address of the sender, the blocktimestamp and the investment goal
        campaignID = keccak256(abi.encodePacked(msg.sender, block.timestamp, _investmentGoal));

        //The amount of tokens to be minted is the investmentGoal divided by 10. Each toke equals 10 USD
        _mint(msg.sender, investmentGoal/10);

        //Emit the event to log the related information
        emit CampaignCreated(msg.sender, campaignID, _interestRate, _paymentFrequency, _totalRepayments, _repaymentGracePeriodDays, _industry, _category);
    }

    /*
    Smart contract functions
    */

    //Function: Start the campaign funding once the owner verifies everything is right
    function startFunding() public onlyOwner {

        //Validate the campaign phase is NEW_CAMPAIGN
        require(currentPhase == CampaignPhase.NEW_CAMPAIGN, "The campaign is not in new campaign phase");
        
        //Change the current phase to in funding
        currentPhase = CampaignPhase.IN_FUNDING;

        //Date of start of the campaign is now
        campaignStartDate = block.timestamp; 

        //If in 60 days the campaign has not been funded it will get aborted
        campaignEndDate = block.timestamp + 60 days;

        //Emit the event to log the related information
        emit FundingStarted(campaignID, campaignStartDate, campaignEndDate);
    }

    //Function: Investor deposits money in the smart contract, which allows him to recieve tokens back
    function depositInvestment(uint256 _amount) public payable {

        //Validate the campaign phase is IN_FUNDING
        require(currentPhase == CampaignPhase.IN_FUNDING, "The campaign is not in funding phase");
        
        //Validate the amount to recieve. Greater than 10 and multiple of 10
        require(_amount >= 10 && _amount%10 == 0, "Amount to deposit must be greater than 10 and multiple of 10");

        //Validate the amount to recieve. Less than is required to be totally funded
        uint256 amountLeftToInvest = investmentGoal-currentlyInvestedFunds;
        require(_amount<=amountLeftToInvest, "Amount to deposit must be less, otherwise exceeds the invesment goal");

        //Recieve the transfer of the USDC token
        bool sent =  usdcToken.transferFrom(msg.sender, address(this), _amount);
        require(sent, "Error on making USDC investment deposit");
       

        //If the investor is depositing for first time, increase the number of investors by 1 and index them

        if (balanceOfInvestedFunds[msg.sender] == 0 && investorIsAlreadyIndexed(msg.sender) == false) {
            indexOfInvestorAddresses[numberOfInvestors] = msg.sender;
            numberOfInvestors++;
        }

        //Update the balance of invested funds for that investor
        balanceOfInvestedFunds[msg.sender] = balanceOfInvestedFunds[msg.sender] + _amount;

        //Update the currently invested funds value
        currentlyInvestedFunds = currentlyInvestedFunds + _amount;

        //Emit the event to log the related information
        emit InvestmentDeposited(msg.sender, _amount, currentlyInvestedFunds);

        //Check if the total of invested funds is already the goal of the campaign
        //and change campaign phase from IN_FUNDING to FUNDED
        if(currentlyInvestedFunds >= investmentGoal) {
            currentPhase = CampaignPhase.FUNDED;

            //The term date starts since the moment its funded plus the repayment grace period days
            termStartDate = block.timestamp + repaymentGracePeriod;

            //The loan maturity date depends on the amount of repayments and the frecuency of payment
            if(paymentFrequency == FrequencyTerms.MONTHLY) {
                loanMaturityDate = termStartDate + totalRepayments * 30;
            }
            if(paymentFrequency == FrequencyTerms.BIMONTHLY) {
                loanMaturityDate = termStartDate + totalRepayments * 60;
            }
            if(paymentFrequency == FrequencyTerms.QUARTERLY) {
                loanMaturityDate = termStartDate + totalRepayments * 90;
            }

            //Emit the event to log the related information
            emit CampaignFunded( campaignID, termStartDate, loanMaturityDate);

        }
    }

    //Function: Issuer executes order to drop tokens to investors based on the proportion of their investments
    //Validate only owner can execute this function
    function dropTokensToInvestors() public onlyOwner {

        //Validate the campaign phase is FUNDED
        require(currentPhase == CampaignPhase.FUNDED, "The campaign is not in funded phase, so can not drop the tokens");

        //Execute for to drop the tokens
        for (uint256 i = 0; i < numberOfInvestors; i++) {

            //Obtain the address of the current investor in the index of investor addresses
            address payable investorAddressToTransfer =  payable(indexOfInvestorAddresses[i]);

            //Drop the tokens based on the stored balance of invested funds. 10 USD = 1 token
            uint256 tokensToDropToInvestor = balanceOfInvestedFunds[investorAddressToTransfer]/10;

            //Approve the transaction of tokens for each investor
            bool approved = approve(investorAddressToTransfer, tokensToDropToInvestor);
            require(approved, "Error on approving the tokens to investor");

            //Transfer tokens to investor
            bool sent = transfer(investorAddressToTransfer, tokensToDropToInvestor);
            require(sent, "Error on dropping tokens to investor");
        }

        //Update the phase of the campaign from FUNDED TO IN_FUNDING_USAGE
        currentPhase = CampaignPhase.IN_FUNDING_USAGE;

        //Emit the event to log the related information
        emit TokensDropped(campaignID, totalSupply());
        
    }

    //Function: Issuer withdraws the funds of his campaign to his own wallet
    //Validate only owner can execute this function
    function withdrawFundsToIssuer(uint256 _amount) public onlyOwner {
        
        //Validate the campaign phase is IN_FUNDING_USAGE
        require(currentPhase == CampaignPhase.IN_FUNDING_USAGE, "The campaign is not in funding usage phase, so it can not withdraw invested funds");

        //Validate the amount to withgraw is more than 10 USD and less than the total funded
        require(_amount >= 10 && _amount <= currentlyInvestedFunds, "The amount to withdraw must be greater than 10 USD and less than the total funded");

        //Transfer USDC that the smart contract has to the owner address
        bool sent =  usdcToken.transfer(owner(), _amount);
        require(sent, "Error on making funds withdrawal to issuer");

        //Update the phase of the campaign from IN_FUNDING_USAGE to IN_REPAYMENT
        currentPhase = CampaignPhase.IN_REPAYMENT;

        //Emit the event to log the related information
        emit FundsWithdrawn(campaignID, msg.sender, _amount);
    }

    //Function: Issuer repays the debt based on the accorded periods
    //Validate only owner can execute this function
    function debtRepayment(uint256 _amount) public payable onlyOwner {

        //Validate the campaign phase is IN_REPAYMENT
        require(currentPhase == CampaignPhase.IN_REPAYMENT, "The campaign is not in repayment phase, so it can not repay funds");

        //Validate the amount to be repayed
        require(_amount >=100 && _amount<=investmentGoal, "The amount to be repayed must be greater than 100 USD and less than the total investment goal");

        //Transfer the debt repayment from issuer to smart contract
        bool sent = usdcToken.transferFrom(msg.sender, address(this), _amount);
        require(sent, "Error on transfering debt repayment from issuer to smart contract");

        //Update the repayed debt amount in the smart contract
        repayedDebtAmount = repayedDebtAmount + _amount;

        //Iterate over each investor to write down the distribution of the repayment funds
        for (uint256 i = 0; i < numberOfInvestors; i++) {

            //Obtain the address of the current investor in the index of investor addresses
            address addressToTransfer = indexOfInvestorAddresses[i];

            //Write down the distribution of the repayment funds, based on the invested percentage of each investor
            uint256 amountOfInvestorTokens = balanceOf(addressToTransfer);
            uint256 amountToRepayToInvestor = (_amount * amountOfInvestorTokens) / totalSupply();

            balanceOfRepayedFunds[addressToTransfer] = amountToRepayToInvestor;
        }

        //Emit the event to log the related information
        emit DebtRepayed(campaignID, _amount, repayedDebtAmount);

    }

    //Function: Investor withdraws his payments back, based on the amunt he wants
    function withdrawPaymentsToInvestor(uint256 _amount) public {
        
        //Validate the campaign phase is IN_REPAYMENT
        require(currentPhase == CampaignPhase.IN_REPAYMENT, "The campaign is not in repayment phase, so investors can not withdraw funds yet");

        //Validate the amount to withdraw is greater than zero and less than the balance
        require(_amount>10 && _amount <= balanceOfRepayedFunds[msg.sender], "Amount to withdraw must be greater than 10 USD and less than balance of investor");

        //First decrease the balance to take care of rentrancy attacks
        balanceOfRepayedFunds[msg.sender] -= _amount;

        //Transfer USDC that the smart contract has to the investor, proportional to his investment
        bool sent =  usdcToken.transfer(msg.sender, _amount);
        require(sent, "Error on transfering USDC that the smart contract has to the investor, porportional to his investment");
        

        //Emit the event to log the related information
        emit PaymentWithdrawn(campaignID, msg.sender, _amount);
        
    }

    //Function: Execute if the campaign did not reach the investment goal
    function abortCampaign() public onlyOwner {

        //Validate the campaign phase is NEW_CAMPAIGN of IN_FUNDING
        require(currentPhase == CampaignPhase.NEW_CAMPAIGN || currentPhase == CampaignPhase.IN_FUNDING, "The campaign is not in New campaign nor in Funding phase");
        
        currentPhase = CampaignPhase.ABORTED;

        //Emit the event to log the related information
        emit CampaignAborted(campaignID);
    }

    //ToDo: Take the investment made back, useful when a campaign gets aborted
    function retakeInvestment (uint256 _amount) public {

        require(currentPhase == CampaignPhase.ABORTED, "The campaign is not in aborted phase");

        //Validate the amount to withdraw is greater than zero and less than the invested balance
        require(_amount>10 && _amount <= balanceOfInvestedFunds[msg.sender], "Amount to withdraw must be greater than 10 USD and less than balance of investor");

        //First decrease the balance to take care of rentrancy attacks
        balanceOfInvestedFunds[msg.sender] -= _amount;

        //Transfer USDC that the smart contract has to the investor, proportional to his investment
        bool sent =  usdcToken.transfer(msg.sender, _amount);
        require(sent, "Error on transfering USDC that the smart contract has to the investor, porportional to his investment");

        //Emit the event to log the related information
        emit InvestmentRetaken(campaignID, msg.sender, _amount);
    }


    /*
    Utility functions
    */

    function investorIsAlreadyIndexed(address _address) public view returns (bool) {
        
        for(uint256 i = 0; i<numberOfInvestors ;i++){

            if(indexOfInvestorAddresses[i] == _address)
            {
                return true;
            }
        }
        return false;
    }

    /*
    Libraries functions
    */

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
