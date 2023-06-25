//https://hardhat.org/tutorial/testing-contracts
//https://ethereum.stackexchange.com/questions/102337/testing-error-thrown-with-hardhat
//https://ethereum.stackexchange.com/questions/139879/how-to-get-usdc-balance-of-impersonated-wallet-in-hardhat-test
//https://ethereum.stackexchange.com/questions/97457/error-transaction-reverted-function-call-to-a-non-contract-account


const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("Test #1. Smart contract right deployment", function () {
 
  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a simple ERC20 token contract to simulate USDC
    const ERC20TokenUSDC = await ethers.getContractFactory('ERC20TokenUSDC');
    const usdcToken = await ERC20TokenUSDC.connect(addr1).deploy();

    //Asociate the smart contract with its name in the context
    const TokenMVP = await ethers.getContractFactory('TokenMVP');

    //Deploy smart contract with stablished parameters
    const tokenMVP = await TokenMVP.deploy(50000, 15, 1, 12, 60, "E-commerce", "Expansion", usdcToken.address);

    //Return values as fixture for the testing cases
    return { tokenMVP, owner, addr1, addr2};
  }

  //TESTING CASE #1
  it('Test #1. should deploy and set the owner correctly', async function () {

    const { tokenMVP, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await tokenMVP.owner()).to.equal(owner.address);
  });
});



describe("Test #1.x Smart contract wrong deployment", function () {
 
  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a simple ERC20 token contract to simulate USDC
    const ERC20TokenUSDC = await ethers.getContractFactory('ERC20TokenUSDC');
    const usdcToken = await ERC20TokenUSDC.connect(addr1).deploy();

    //Asociate the smart contract with its name in the context
    const TokenMVP = await ethers.getContractFactory('TokenMVP');

    //Return values as fixture for the testing cases
    return { TokenMVP, owner, addr1, addr2, usdcToken};
  }

  //TESTING CASE #1.1
  it('Test #1.1 should not deploy because the investment goal value is wrong', async function () {

    const { TokenMVP, owner, usdcToken } = await loadFixture(deployContractAndSetVariables);

      await expect( TokenMVP.deploy(29000, 15, 1, 12, 60, "E-commerce", "Expansion", usdcToken.address) )
        .to.be.revertedWith('Investment goal must be greater than 30000 USD');
  });

  //TESTING CASE #1.2
    it('Test #1.2 should not deploy because the interest rate value is wrong', async function () {

      const { TokenMVP, owner, usdcToken } = await loadFixture(deployContractAndSetVariables);
  
        await expect( TokenMVP.deploy(30000, 4, 1, 12, 60, "E-commerce", "Expansion", usdcToken.address) )
          .to.be.revertedWith('Interest rate must be greater than 5 %');
    });

  //TESTING CASE #1.3
  it('Test #1.3 should not deploy because the payment frequency value is wrong', async function () {

    const { TokenMVP, owner, usdcToken } = await loadFixture(deployContractAndSetVariables);

      await expect( TokenMVP.deploy(30000, 15, 4, 12, 60, "E-commerce", "Expansion", usdcToken.address) )
        .to.be.revertedWith('function was called with incorrect parameters');
  });

  //TESTING CASE #1.4
    it('Test #1.4 should not deploy because the total repayments value is wrong', async function () {

      const { TokenMVP, owner, usdcToken } = await loadFixture(deployContractAndSetVariables);
  
        await expect( TokenMVP.deploy(30000, 15, 1, 3, 60, "E-commerce", "Expansion", usdcToken.address) )
          .to.be.revertedWith('Total number of repayments must be at least 4');
    });

  //TESTING CASE #1.5
  it('Test #1.5 should not deploy because the days of repayment grace period is wrong', async function () {

    const { TokenMVP, owner, usdcToken } = await loadFixture(deployContractAndSetVariables);

      await expect( TokenMVP.deploy(30000, 15, 1, 12, 120, "E-commerce", "Expansion", usdcToken.address) )
        .to.be.revertedWith('Repayment grace period must be between 0 and 90 days');
  });

    //TESTING CASE #1.6
    it('Test #1.6 should not deploy because the industry value is empty', async function () {

      const { TokenMVP, owner, usdcToken } = await loadFixture(deployContractAndSetVariables);
  
        await expect( TokenMVP.deploy(30000, 15, 1, 12, 90, "", "Expansion", usdcToken.address) )
          .to.be.revertedWith('The industry parameter can not be empty');
    });

    //TESTING CASE #1.7
    it('Test #1.7 should not deploy because the category value is empty', async function () {

      const { TokenMVP, owner, usdcToken } = await loadFixture(deployContractAndSetVariables);
  
        await expect( TokenMVP.deploy(30000, 15, 1, 12, 90, "E-commerce", "", usdcToken.address) )
          .to.be.revertedWith('The category parameter can not be empty');
    });
});



describe("Test #2. Start funding campaign", function () {
 
  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a simple ERC20 token contract to simulate USDC
    const ERC20TokenUSDC = await ethers.getContractFactory('ERC20TokenUSDC');
    const usdcToken = await ERC20TokenUSDC.connect(addr1).deploy();

    //Asociate the smart contract with its name in the context
    const TokenMVP = await ethers.getContractFactory('TokenMVP');

    //Deploy smart contract with stablished parameters
    const tokenMVP = await TokenMVP.deploy(50000, 15, 1, 12, 60, "E-commerce", "Expansion", usdcToken.address);

    //Return values as fixture for the testing cases
    return { tokenMVP, owner, addr1, addr2};
  }

  //TESTING CASE #2
  it('Test #2. should change the campaign phase to IN_FUNDING (#2)', async function () {

    const { tokenMVP, owner } = await loadFixture(deployContractAndSetVariables);

    await tokenMVP.startFunding();

    expect(await tokenMVP.currentPhase()).to.equal(2);
  });

  //TESTING CASE #2.1
    it('Test #2.1 should not change the campaign phase because its not an authorized address', async function () {

      const { tokenMVP, owner, addr1 } = await loadFixture(deployContractAndSetVariables);
  
      await expect( tokenMVP.connect(addr1).startFunding() )
          .to.be.revertedWith('Ownable: caller is not the owner');
    });
});


describe("Test #3. Deposit of investment", function () {
 
  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a simple ERC20 token contract to simulate USDC
    const ERC20TokenUSDC = await ethers.getContractFactory('ERC20TokenUSDC');
    const usdcToken = await ERC20TokenUSDC.connect(addr1).deploy();

    //Asociate the smart contract with its name in the context
    const TokenMVP = await ethers.getContractFactory('TokenMVP');

    //Deploy smart contract with stablished parameters
    const tokenMVP = await TokenMVP.deploy(50000, 15, 1, 12, 60, "E-commerce", "Expansion", usdcToken.address);

    //Return values as fixture for the testing cases
    return { tokenMVP, owner, addr1, addr2, usdcToken};
  }

  //TESTING CASE #3
  it('Test #3. should deposit funds in the campaign', async function () {

    const { tokenMVP, owner, addr1, usdcToken } = await loadFixture(deployContractAndSetVariables);

    //Change the phase of the campaign to start the funding
    await tokenMVP.startFunding();

    //Get the contract balance before the transaction
    const initialContractBalance = await usdcToken.balanceOf(tokenMVP.address);

    // Mint USDC tokens to the addr1 account
    await usdcToken.connect(addr1).mint(addr1.address, 100);

    // Approve the token transfer from addr1 to tokenMVP contract
    await usdcToken.connect(addr1).approve(tokenMVP.address, 100);

    // Deposit the investment of 100 USDC tokens from the investor account "addr1" to the smart contract
    await tokenMVP.connect(addr1).depositInvestment(100);
    
    //Get the contract balance after the transaction
    const finalContractBalance = await usdcToken.balanceOf(tokenMVP.address);
    
    //The smart contract final balance of USDC must be equal to the initial one plus the deposited investment
    await expect(initialContractBalance + 100).to.equal(finalContractBalance);

    //The internal record of balances of invested funds for addr1 must be updated
    expect(await tokenMVP.balanceOfInvestedFunds(addr1.address)).to.equal(100);

    //The internal record of currently invested funds must be updated
    expect(await tokenMVP.currentlyInvestedFunds() ).to.equal(100);
  });

});

describe("Test #3.x Deposit failed of investment", function () {
 
  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a simple ERC20 token contract to simulate USDC
    const ERC20TokenUSDC = await ethers.getContractFactory('ERC20TokenUSDC');
    const usdcToken = await ERC20TokenUSDC.connect(addr1).deploy();

    //Asociate the smart contract with its name in the context
    const TokenMVP = await ethers.getContractFactory('TokenMVP');

    //Deploy smart contract with stablished parameters
    const tokenMVP = await TokenMVP.deploy(50000, 15, 1, 12, 60, "E-commerce", "Expansion", usdcToken.address);

    //Return values as fixture for the testing cases
    return { tokenMVP, owner, addr1, addr2, usdcToken};
  }

    //TESTING CASE #3.1 
    it('Test #3.1 should not deposit funds in the campaign because its not in funding phase', async function () {

      const { tokenMVP, owner, addr1, usdcToken } = await loadFixture(deployContractAndSetVariables);
  
      // Mint USDC tokens to the addr1 account
      await usdcToken.connect(addr1).mint(addr1.address, 100);
  
      // Approve the token transfer from addr1 to tokenMVP contract
      await usdcToken.connect(addr1).approve(tokenMVP.address, 100);
      
      await expect( tokenMVP.connect(addr1).depositInvestment(100) )
      .to.be.revertedWith('The campaign is not in funding phase');
    });

    //TESTING CASE #3.2
    it('Test #3.2 should not deposit funds in the campaign because the amount must be greater than 10', async function () {

      const { tokenMVP, owner, addr1, usdcToken } = await loadFixture(deployContractAndSetVariables);

      //Change the phase of the campaign to start the funding
      await tokenMVP.startFunding();
  
      // Mint USDC tokens to the addr1 account
      await usdcToken.connect(addr1).mint(addr1.address, 100);
  
      // Approve the token transfer from addr1 to tokenMVP contract
      await usdcToken.connect(addr1).approve(tokenMVP.address, 8);
      
      await expect( tokenMVP.connect(addr1).depositInvestment(8) )
      .to.be.revertedWith('Amount to deposit must be greater than 10 and multiple of 10');
    });

    //TESTING CASE #3.2
    it('Test #3.2 should not deposit funds in the campaign because the amount is not a multiple of 10', async function () {

      const { tokenMVP, owner, addr1, usdcToken } = await loadFixture(deployContractAndSetVariables);

      //Change the phase of the campaign to start the funding
      await tokenMVP.startFunding();
  
      // Mint USDC tokens to the addr1 account
      await usdcToken.connect(addr1).mint(addr1.address, 100);
  
      // Approve the token transfer from addr1 to tokenMVP contract
      await usdcToken.connect(addr1).approve(tokenMVP.address, 15);
      
      await expect( tokenMVP.connect(addr1).depositInvestment(15) )
      .to.be.revertedWith('Amount to deposit must be greater than 10 and multiple of 10');
    });

    //TESTING CASE #3.3
    it('Test #3.3 should not deposit funds because it exceeds the investment goal', async function () {

      const { tokenMVP, owner, addr1, usdcToken } = await loadFixture(deployContractAndSetVariables);

      //Change the phase of the campaign to start the funding
      await tokenMVP.startFunding();
  
      // Mint USDC tokens to the addr1 account
      await usdcToken.connect(addr1).mint(addr1.address, 100000);
  
      // Approve the token transfer from addr1 to tokenMVP contract
      await usdcToken.connect(addr1).approve(tokenMVP.address, 100000);
      
      await expect( tokenMVP.connect(addr1).depositInvestment(100000) )
      .to.be.revertedWith('Amount to deposit must be less, otherwise exceeds the invesment goal');
    });

    //TESTING CASE #3.4
    it('Test #3.4 should not deposit funds because it is already funded', async function () {

      const { tokenMVP, owner, addr1, addr2, usdcToken } = await loadFixture(deployContractAndSetVariables);

      //Change the phase of the campaign to start the funding
      await tokenMVP.startFunding();
  
      // Mint USDC tokens to the addr1 account
      await usdcToken.connect(addr1).mint(addr1.address, 50000);
      // Mint USDC tokens to the addr2 account
      await usdcToken.connect(addr1).mint(addr2.address, 10);
  
      // Approve the token transfer from addr1 to tokenMVP contract
      await usdcToken.connect(addr1).approve(tokenMVP.address, 50000);
      // Approve the token transfer from addr2 to tokenMVP contract
      await usdcToken.connect(addr2).approve(tokenMVP.address, 10);

      //Deposit enough funds to get to fund the whole campaign
      await tokenMVP.connect(addr1).depositInvestment(50000);
      
      await expect(tokenMVP.connect(addr2).depositInvestment(10) )
      .to.be.revertedWith('The campaign is not in funding phase');
    });

    //TESTING CASE #3.5
    it('Test #3.5 the term start and loan maturity date have been updated', async function () {

      const { tokenMVP, owner, addr1, addr2, usdcToken } = await loadFixture(deployContractAndSetVariables);

      //Change the phase of the campaign to start the funding
      await tokenMVP.startFunding();
  
      // Mint USDC tokens to the addr1 account
      await usdcToken.connect(addr1).mint(addr1.address, 50000);
      // Mint USDC tokens to the addr2 account
      await usdcToken.connect(addr1).mint(addr2.address, 10);
  
      // Approve the token transfer from addr1 to tokenMVP contract
      await usdcToken.connect(addr1).approve(tokenMVP.address, 50000);
      // Approve the token transfer from addr2 to tokenMVP contract
      await usdcToken.connect(addr2).approve(tokenMVP.address, 10);

      //Deposit enough funds to get to fund the whole campaign
      await tokenMVP.connect(addr1).depositInvestment(50000);
      
      const currentBlock = await ethers.provider.getBlockNumber();
      const blockTimestamp = (await ethers.provider.getBlock(currentBlock)).timestamp;

      //The term start date must be updated
      const termStartDateCalculated = Number(blockTimestamp + await tokenMVP.repaymentGracePeriod());
      expect(await tokenMVP.termStartDate()).to.equal(termStartDateCalculated);

      //The loan maturity date must be updated
      const loanMaturityDateCalculated = Number(await tokenMVP.termStartDate()) + Number((await tokenMVP.totalRepayments())*60);
      expect(await tokenMVP.loanMaturityDate()).to.equal(loanMaturityDateCalculated);

    });

    
});