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
        .to.be.revertedWith('Investment goal must be greater than 30K USD and less than 1M USD');
  });

  //TESTING CASE #1.2
    it('Test #1.2 should not deploy because the interest rate value is wrong', async function () {

      const { TokenMVP, owner, usdcToken } = await loadFixture(deployContractAndSetVariables);
  
        await expect( TokenMVP.deploy(30000, 4, 1, 12, 60, "E-commerce", "Expansion", usdcToken.address) )
          .to.be.revertedWith('Interest rate must be greater than 5% and less than 60%');
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
          .to.be.revertedWith('Total number of repayments must be at least 4 and less than 48');
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

    // Deposit the investment of USDC tokens from the investor account "addr1" to the smart contract
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


describe("Test #4. Drop tokens to investors", function () {
 
  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy a simple ERC20 token contract to simulate USDC
    const ERC20TokenUSDC = await ethers.getContractFactory('ERC20TokenUSDC');
    const usdcToken = await ERC20TokenUSDC.connect(addr1).deploy();

    //Asociate the smart contract with its name in the context
    const TokenMVP = await ethers.getContractFactory('TokenMVP');

    //Deploy smart contract with stablished parameters
    const tokenMVP = await TokenMVP.deploy(50000, 15, 1, 12, 60, "E-commerce", "Expansion", usdcToken.address);

    //Change the phase of the campaign to start the funding
    await tokenMVP.startFunding();

    // Mint USDC tokens to the addr1 account
    await usdcToken.connect(addr1).mint(addr1.address, 100000);
    // Mint USDC tokens to the addr2 account
    await usdcToken.connect(addr1).mint(addr2.address, 100000);
    // Mint USDC tokens to the addr3 account
    await usdcToken.connect(addr1).mint(addr3.address, 100000);

    // Approve the token transfer from addr1 to tokenMVP contract
    await usdcToken.connect(addr1).approve(tokenMVP.address, 20000);
    // Approve the token transfer from addr2 to tokenMVP contract
    await usdcToken.connect(addr2).approve(tokenMVP.address, 20000);
    // Approve the token transfer from addr3 to tokenMVP contract
    await usdcToken.connect(addr3).approve(tokenMVP.address, 10000);

    // Deposit the investment of USDC tokens from the investor account "addr1" to the smart contract
    await tokenMVP.connect(addr1).depositInvestment(20000);
    // Deposit the investment of USDC tokens from the investor account "addr2" to the smart contract
    await tokenMVP.connect(addr2).depositInvestment(20000);
    // Deposit the investment of USDC tokens from the investor account "addr3" to the smart contract
    await tokenMVP.connect(addr3).depositInvestment(10000);

    //Return values as fixture for the testing cases
    return { tokenMVP, owner, addr1, addr2, addr3};
  }

  //TESTING CASE #4
  it('Test #4. Drop tokens to investors based on the percentage of invested funds', async function () {

    const { tokenMVP, owner, addr1, addr2, addr3} = await loadFixture(deployContractAndSetVariables);

    //Drop the tokens and distribute them based on the percentage of provided funds
    await tokenMVP.connect(owner).dropTokensToInvestors();

    //Verify each investor has the right ammount of tokens based on their investments
    expect(await tokenMVP.balanceOf(addr1.address)).to.equal(2000);
    expect(await tokenMVP.balanceOf(addr2.address)).to.equal(2000);
    expect(await tokenMVP.balanceOf(addr3.address)).to.equal(1000);
  });

  //TESTING CASE #4.1
  it('Test #4.1 Drop tokens to investors and validate the new campaign phase', async function () {

    const { tokenMVP, owner} = await loadFixture(deployContractAndSetVariables);

    //Drop the tokens and distribute them based on the percentage of provided funds
    await tokenMVP.connect(owner).dropTokensToInvestors();
    
    //Verify the new phase is according to the expected one
    expect(await tokenMVP.currentPhase()).to.equal(4);
  });

  //TESTING CASE #4.2
    it('Test #4.2 should not drop the tokens because its not an authorized address', async function () {

      const { tokenMVP, owner, addr1 } = await loadFixture(deployContractAndSetVariables);
  
      //Get an error if anyone who is not the owner tries to drop the tokens
      await expect( tokenMVP.connect(addr1).dropTokensToInvestors() )
          .to.be.revertedWith('Ownable: caller is not the owner');
    });

});


describe("Test #5. Withdraw funds to issuer", function () {
 
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

    //Change the phase of the campaign to start the funding
    await tokenMVP.startFunding();

    // Mint USDC tokens to the addr1 account
    await usdcToken.connect(addr1).mint(addr1.address, 100000);
    // Approve the token transfer from addr1 to tokenMVP contract
    await usdcToken.connect(addr1).approve(tokenMVP.address, 50000);

    //Return values as fixture for the testing cases
    return { tokenMVP, owner, addr1, addr2, usdcToken};
  }

  //TESTING CASE #5
  it('Test #5. should withdraw the funds to the issuer', async function () {

    const { tokenMVP, owner, addr1, addr2, usdcToken } = await loadFixture(deployContractAndSetVariables);

    // Deposit the investment of USDC tokens from the investor account "addr1" to the smart contract
    await tokenMVP.connect(addr1).depositInvestment(50000);

    //Drop the tokens and distribute them based on the percentage of provided funds
    await tokenMVP.connect(owner).dropTokensToInvestors();

    //Get the owner balance before the transaction
    const initialOwnerBalance = await usdcToken.balanceOf(owner.address);

    //Withdraw a requested amount of funds to the issuer
    await tokenMVP.withdrawFundsToIssuer(100);

    //Get the owner balance after the transaction
    const finalOwnerBalance = await usdcToken.balanceOf(owner.address);
    
    //The owner address final balance of USDC must be equal to the initial one plus the deposited investment
    await expect(initialOwnerBalance + 100).to.equal(finalOwnerBalance);
  });

  //TESTING CASE #5.1
  it('Test #5.1 should not withdraw funds because its not the owner', async function () {

    const { tokenMVP, owner, addr1 } = await loadFixture(deployContractAndSetVariables);
  
    await expect( tokenMVP.connect(addr1).withdrawFundsToIssuer(100) )
        .to.be.revertedWith('Ownable: caller is not the owner');
  });

  //TESTING CASE #5.2
  it('Test #5.2 should not withdraw funds because its not the right phase', async function () {

    const { tokenMVP, owner, addr1 } = await loadFixture(deployContractAndSetVariables);

    // Deposit the investment of USDC tokens from the investor account "addr1" to the smart contract
    await tokenMVP.connect(addr1).depositInvestment(50000);

    await expect( tokenMVP.connect(owner).withdrawFundsToIssuer(100) )
        .to.be.revertedWith('The campaign is not in funding usage phase, so it can not withdraw invested funds');
  });

  //TESTING CASE #5.3
  it('Test #5.3 should not withdraw funds because the amount is lower than required', async function () {

    const { tokenMVP, owner, addr1 } = await loadFixture(deployContractAndSetVariables);
  
    // Deposit the investment of USDC tokens from the investor account "addr1" to the smart contract
    await tokenMVP.connect(addr1).depositInvestment(50000);

    //Drop the tokens and distribute them based on the percentage of provided funds
    await tokenMVP.connect(owner).dropTokensToInvestors();

    //Withdraw a requested amount of funds to the issuer
    await expect( tokenMVP.connect(owner).withdrawFundsToIssuer(8) )
       .to.be.revertedWith('The amount to withdraw must be greater than 10 USD and less than the total funded');
  });

  //TESTING CASE #5.3
  it('Test #5.4 should not withdraw funds because the amount is greater than the funded', async function () {

    const { tokenMVP, owner, addr1 } = await loadFixture(deployContractAndSetVariables);
      
    // Deposit the investment of USDC tokens from the investor account "addr1" to the smart contract
    await tokenMVP.connect(addr1).depositInvestment(50000);
    
    //Drop the tokens and distribute them based on the percentage of provided funds
    await tokenMVP.connect(owner).dropTokensToInvestors();
    
    //Withdraw a requested amount of funds to the issuer
    await expect( tokenMVP.connect(owner).withdrawFundsToIssuer(70000) )
         .to.be.revertedWith('The amount to withdraw must be greater than 10 USD and less than the total funded');
    });
});



describe("Test #6. Repayment of debt", function () {
 
    //Create fixture to deploy smart contract and set initial variables
    async function deployContractAndSetVariables() {

    //Get signers (accounts) that will be testing the smart contract functions
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy a simple ERC20 token contract to simulate USDC
    const ERC20TokenUSDC = await ethers.getContractFactory('ERC20TokenUSDC');
    const usdcToken = await ERC20TokenUSDC.connect(addr1).deploy();

    //Asociate the smart contract with its name in the context
    const TokenMVP = await ethers.getContractFactory('TokenMVP');

    //Deploy smart contract with stablished parameters
    const tokenMVP = await TokenMVP.deploy(50000, 15, 1, 12, 60, "E-commerce", "Expansion", usdcToken.address);

    //Change the phase of the campaign to start the funding
    await tokenMVP.startFunding();

    // Mint USDC tokens to the addr1 account
    await usdcToken.connect(addr1).mint(addr1.address, 20000);
    // Approve the token transfer from addr1 to tokenMVP contract
    await usdcToken.connect(addr1).approve(tokenMVP.address, 20000);

    // Mint USDC tokens to the addr2 account
    await usdcToken.connect(addr1).mint(addr2.address, 20000);
    // Approve the token transfer from addr2 to tokenMVP contract
    await usdcToken.connect(addr2).approve(tokenMVP.address, 20000);

    // Mint USDC tokens to the addr3 account
    await usdcToken.connect(addr1).mint(addr3.address, 10000);
    // Approve the token transfer from addr3 to tokenMVP contract
    await usdcToken.connect(addr3).approve(tokenMVP.address, 10000);


    // Deposit the investment of USDC tokens from the investor account "addr1" to the smart contract
    await tokenMVP.connect(addr1).depositInvestment(20000);
    // Deposit the investment of USDC tokens from the investor account "addr2" to the smart contract
    await tokenMVP.connect(addr2).depositInvestment(20000);
    // Deposit the investment of USDC tokens from the investor account "addr3" to the smart contract
    await tokenMVP.connect(addr3).depositInvestment(10000);

    //Drop the tokens and distribute them based on the percentage of provided funds
    await tokenMVP.connect(owner).dropTokensToInvestors();

    //Return values as fixture for the testing cases
    return { tokenMVP, owner, addr1, addr2, addr3, usdcToken};

  }

  //TESTING CASE #6
  it('Test #6. should make a repayment of the investors debt, based on an ammount deposited by the issuer', async function () {

    const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);

    //Withdraw a requested amount of funds to the issuer
    await tokenMVP.withdrawFundsToIssuer(50000);

    // Approve the token transfer from addr1 to tokenMVP contract
    await usdcToken.connect(owner).approve(tokenMVP.address, 10000);

    //Execute the repayment of the debt based on an specific amount
    await tokenMVP.connect(owner).debtRepayment(10000);

    //Verify the balance of repayed debt gets updated
    expect(await tokenMVP.repayedDebtAmount()).to.equal(10000);

    //Verify each investor has the right ammount of tokens based on their investments
    expect(await tokenMVP.balanceOfRepayedFunds(addr1.address)).to.equal(4000);
    expect(await tokenMVP.balanceOfRepayedFunds(addr2.address)).to.equal(4000);
    expect(await tokenMVP.balanceOfRepayedFunds(addr3.address)).to.equal(2000);
  });


  
  //TESTING CASE #6.1
  it('Test #6.1 should not make a repayment because its not the right phase', async function () {

    const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);

    // Mint USDC tokens to the addr2 account
    await usdcToken.connect(addr1).mint(owner.address, 20000);

    // Approve the token transfer from addr1 to tokenMVP contract
    await usdcToken.connect(owner).approve(tokenMVP.address, 10000);

    await expect( tokenMVP.connect(owner).debtRepayment(10000) )
    .to.be.revertedWith('The campaign is not in repayment phase, so it can not repay funds');
  });

  //TESTING CASE #6.2
  it('Test #6.2 should not make a repayment because its not the owner', async function () {

     const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);
  
     // Mint USDC tokens to the addr2 account
    await usdcToken.connect(addr1).mint(addr1.address, 20000);
  
    // Approve the token transfer from addr1 to tokenMVP contract
    await usdcToken.connect(addr1).approve(tokenMVP.address, 10000);
  
    await expect( tokenMVP.connect(addr1).debtRepayment(10000) )
      .to.be.revertedWith('Ownable: caller is not the owner');
  });

  //TESTING CASE #6.3
  it('Test #6.3 should not make the repayment because the amount is less than 100 usd', async function () {

    const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);
 
    //Withdraw a requested amount of funds to the issuer
    await tokenMVP.withdrawFundsToIssuer(50000);

    // Approve the token transfer from addr1 to tokenMVP contract
    await usdcToken.connect(owner).approve(tokenMVP.address, 90);

    await expect( tokenMVP.connect(owner).debtRepayment(90) )
    .to.be.revertedWith('The amount to be repayed must be greater than 100 USD and less than the total investment goal');
 });

});



describe("Test #7. Withdraw repayments to investor", function () {
 
  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

  //Get signers (accounts) that will be testing the smart contract functions
  const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

  // Deploy a simple ERC20 token contract to simulate USDC
  const ERC20TokenUSDC = await ethers.getContractFactory('ERC20TokenUSDC');
  const usdcToken = await ERC20TokenUSDC.connect(addr1).deploy();

  //Asociate the smart contract with its name in the context
  const TokenMVP = await ethers.getContractFactory('TokenMVP');

  //Deploy smart contract with stablished parameters
  const tokenMVP = await TokenMVP.deploy(50000, 15, 1, 12, 60, "E-commerce", "Expansion", usdcToken.address);

  //Change the phase of the campaign to start the funding
  await tokenMVP.startFunding();

  // Mint USDC tokens to the addr1 account
  await usdcToken.connect(addr1).mint(addr1.address, 20000);
  // Approve the token transfer from addr1 to tokenMVP contract
  await usdcToken.connect(addr1).approve(tokenMVP.address, 20000);

  // Mint USDC tokens to the addr2 account
  await usdcToken.connect(addr1).mint(addr2.address, 20000);
  // Approve the token transfer from addr2 to tokenMVP contract
  await usdcToken.connect(addr2).approve(tokenMVP.address, 20000);

  // Mint USDC tokens to the addr3 account
  await usdcToken.connect(addr1).mint(addr3.address, 10000);
  // Approve the token transfer from addr3 to tokenMVP contract
  await usdcToken.connect(addr3).approve(tokenMVP.address, 10000);


  // Deposit the investment of USDC tokens from the investor account "addr1" to the smart contract
  await tokenMVP.connect(addr1).depositInvestment(20000);
  // Deposit the investment of USDC tokens from the investor account "addr2" to the smart contract
  await tokenMVP.connect(addr2).depositInvestment(20000);
  // Deposit the investment of USDC tokens from the investor account "addr3" to the smart contract
  await tokenMVP.connect(addr3).depositInvestment(10000);

  //Drop the tokens and distribute them based on the percentage of provided funds
  await tokenMVP.connect(owner).dropTokensToInvestors();

  //Return values as fixture for the testing cases
  return { tokenMVP, owner, addr1, addr2, addr3, addr4, usdcToken};

}

//TESTING CASE #7
it('Test #7. should make withdrawal of repayment to an investor', async function () {

  const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);

  //Withdraw a requested amount of funds to the issuer
  await tokenMVP.withdrawFundsToIssuer(50000);

  // Approve the token transfer from owner to tokenMVP contract
  await usdcToken.connect(owner).approve(tokenMVP.address, 10000);

  //Execute the repayment of the debt based on an specific amount
  await tokenMVP.connect(owner).debtRepayment(10000);

  //Get the addr1 balance before the transaction
  const initialOwnerBalance = await usdcToken.balanceOf(addr1.address);

  //Execute the repayment of the debt based on an specific amount
  await tokenMVP.connect(addr1).withdrawPaymentsToInvestor(1000);

  //Get the addr1 balance after the transaction
  const finalOwnerBalance = await usdcToken.balanceOf(addr1.address);
    
  //The addr1 address final balance of USDC must be equal to the initial one plus the drecently made repayment
  await expect(initialOwnerBalance + 1000).to.equal(finalOwnerBalance);

});

//TESTING CASE #7.1
it('Test #7.1 should not make the withdrawal of repayment because the amount is greater than the balance ', async function () {

  const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);

  //Withdraw a requested amount of funds to the issuer
  await tokenMVP.withdrawFundsToIssuer(50000);

  // Approve the token transfer from owner to tokenMVP contract
  await usdcToken.connect(owner).approve(tokenMVP.address, 10000);

  //Execute the repayment of the debt based on an specific amount
  await tokenMVP.connect(owner).debtRepayment(10000);

  //The repayment must be reverted because the amount is more than the actual balance
  await expect( tokenMVP.connect(addr1).withdrawPaymentsToInvestor(5000))
  .to.be.revertedWith('Amount to withdraw must be greater than 10 USD and less than balance of investor');

  await tokenMVP.connect(addr1).withdrawPaymentsToInvestor(4000);

  //The repayment must be reverted because the amount is more than the actual balance
  await expect( tokenMVP.connect(addr1).withdrawPaymentsToInvestor(9))
  .to.be.revertedWith('Amount to withdraw must be greater than 10 USD and less than balance of investor');

});

//TESTING CASE #7.2
it('Test #7.2 should not make the withdrawal of repayment because its not in the right phase', async function () {

  const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);

  await expect( tokenMVP.connect(addr1).withdrawPaymentsToInvestor(10))
  .to.be.revertedWith('The campaign is not in repayment phase, so investors can not withdraw funds yet');
});



//TESTING CASE #7.3
it('Test #7.3 should not make the withdrawal of repayment because the address doesnt have any balance', async function () {

  const { tokenMVP, owner, addr1, addr2, addr3, addr4, usdcToken} = await loadFixture(deployContractAndSetVariables);

  //Withdraw a requested amount of funds to the issuer
  await tokenMVP.withdrawFundsToIssuer(50000);

  // Approve the token transfer from owner to tokenMVP contract
  await usdcToken.connect(owner).approve(tokenMVP.address, 10000);

  //Execute the repayment of the debt based on an specific amount
  await tokenMVP.connect(owner).debtRepayment(10000);

  //The repayment must be reverted because the address doesnt have any balance
  await expect( tokenMVP.connect(addr4).withdrawPaymentsToInvestor(1000))
  .to.be.revertedWith('Amount to withdraw must be greater than 10 USD and less than balance of investor');

});

});



describe("Test #8. Abort the campaign by order of the owner", function () {
 
  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

  //Get signers (accounts) that will be testing the smart contract functions
  const [owner, addr1, addr2, addr3] = await ethers.getSigners();

  // Deploy a simple ERC20 token contract to simulate USDC
  const ERC20TokenUSDC = await ethers.getContractFactory('ERC20TokenUSDC');
  const usdcToken = await ERC20TokenUSDC.connect(addr1).deploy();

  //Asociate the smart contract with its name in the context
  const TokenMVP = await ethers.getContractFactory('TokenMVP');

  //Deploy smart contract with stablished parameters
  const tokenMVP = await TokenMVP.deploy(50000, 15, 1, 12, 60, "E-commerce", "Expansion", usdcToken.address);

  return { tokenMVP, owner, addr1, addr2, addr3, usdcToken};

}

//TESTING CASE #8
it('Test #8. should abort the campaign in NEW_CAMPAIGN phase', async function () {

  const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);

  // Execute the abort campaign function
  await tokenMVP.connect(owner).abortCampaign();
    
  //The new current phase of the campaign must be aborted (6)
  await expect(await tokenMVP.currentPhase()).to.equal(6);

});

//TESTING CASE #8.1
it('Test #8.1 should abort the campaign IN_FUNDING phase', async function () {

  const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);

  //Change the phase of the campaign to start the funding
  await tokenMVP.startFunding();

  // Execute the abort campaign function
  await tokenMVP.connect(owner).abortCampaign();
    
  //The new current phase of the campaign must be aborted (6)
  await expect(await tokenMVP.currentPhase()).to.equal(6);
  
});

//TESTING CASE #8.2
it('Test #8.2 should abort the campaign IN_FUNDING phase with deposited funds', async function () {

  const { tokenMVP, owner, addr1, addr2, usdcToken} = await loadFixture(deployContractAndSetVariables);

   //Change the phase of the campaign to start the funding
   await tokenMVP.startFunding();

   // Mint USDC tokens to the addr1 account
   await usdcToken.connect(addr1).mint(addr1.address, 20000);
   // Approve the token transfer from addr1 to tokenMVP contract
   await usdcToken.connect(addr1).approve(tokenMVP.address, 20000);
 
   // Mint USDC tokens to the addr2 account
   await usdcToken.connect(addr1).mint(addr2.address, 20000);
   // Approve the token transfer from addr2 to tokenMVP contract
   await usdcToken.connect(addr2).approve(tokenMVP.address, 20000);

 
   // Deposit the investment of USDC tokens from the investor account "addr1" to the smart contract
   await tokenMVP.connect(addr1).depositInvestment(20000);
   // Deposit the investment of USDC tokens from the investor account "addr2" to the smart contract
   await tokenMVP.connect(addr2).depositInvestment(20000);

    
    // Execute the abort campaign function
    await tokenMVP.connect(owner).abortCampaign();
    
    //The new current phase of the campaign must be aborted (6)
    await expect(await tokenMVP.currentPhase()).to.equal(6);

});

//TESTING CASE #8.3
it('Test #8.3 should not abort the campaign after being totally funded', async function () {

  const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);

   //Change the phase of the campaign to start the funding
   await tokenMVP.startFunding();

   // Mint USDC tokens to the addr1 account
   await usdcToken.connect(addr1).mint(addr1.address, 20000);
   // Approve the token transfer from addr1 to tokenMVP contract
   await usdcToken.connect(addr1).approve(tokenMVP.address, 20000);
 
   // Mint USDC tokens to the addr2 account
   await usdcToken.connect(addr1).mint(addr2.address, 20000);
   // Approve the token transfer from addr2 to tokenMVP contract
   await usdcToken.connect(addr2).approve(tokenMVP.address, 20000);
 
   // Mint USDC tokens to the addr3 account
   await usdcToken.connect(addr1).mint(addr3.address, 10000);
   // Approve the token transfer from addr3 to tokenMVP contract
   await usdcToken.connect(addr3).approve(tokenMVP.address, 10000);
 
 
   // Deposit the investment of USDC tokens from the investor account "addr1" to the smart contract
   await tokenMVP.connect(addr1).depositInvestment(20000);
   // Deposit the investment of USDC tokens from the investor account "addr2" to the smart contract
   await tokenMVP.connect(addr2).depositInvestment(20000);
   // Deposit the investment of USDC tokens from the investor account "addr3" to the smart contract
   await tokenMVP.connect(addr3).depositInvestment(10000);
    
  // Execute the abort campaign function
  await expect( tokenMVP.connect(owner).abortCampaign())
    .to.be.revertedWith('The campaign is not in New campaign nor in Funding phase');
  
});

});



describe("Test #9. Withdraw repayments to investor", function () {
 
  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

  //Get signers (accounts) that will be testing the smart contract functions
  const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

  // Deploy a simple ERC20 token contract to simulate USDC
  const ERC20TokenUSDC = await ethers.getContractFactory('ERC20TokenUSDC');
  const usdcToken = await ERC20TokenUSDC.connect(addr1).deploy();

  //Asociate the smart contract with its name in the context
  const TokenMVP = await ethers.getContractFactory('TokenMVP');

  //Deploy smart contract with stablished parameters
  const tokenMVP = await TokenMVP.deploy(50000, 15, 1, 12, 60, "E-commerce", "Expansion", usdcToken.address);

  //Change the phase of the campaign to start the funding
  await tokenMVP.startFunding();

  // Mint USDC tokens to the addr1 account
  await usdcToken.connect(addr1).mint(addr1.address, 20000);
  // Approve the token transfer from addr1 to tokenMVP contract
  await usdcToken.connect(addr1).approve(tokenMVP.address, 20000);

  // Mint USDC tokens to the addr2 account
  await usdcToken.connect(addr1).mint(addr2.address, 10000);
  // Approve the token transfer from addr2 to tokenMVP contract
  await usdcToken.connect(addr2).approve(tokenMVP.address, 10000);


  // Deposit the investment of USDC tokens from the investor account "addr1" to the smart contract
  await tokenMVP.connect(addr1).depositInvestment(20000);
  // Deposit the investment of USDC tokens from the investor account "addr2" to the smart contract
  await tokenMVP.connect(addr2).depositInvestment(10000);


  //Return values as fixture for the testing cases
  return { tokenMVP, owner, addr1, addr2, addr3, addr4, usdcToken};

}

//TESTING CASE #9
it('Test #9. should retake the invested funds of an aborted campaign for addr1', async function () {

  const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);

  // Execute the abort campaign function
  await tokenMVP.connect(owner).abortCampaign();

  //Get the addr1 balance before the transaction
  const initialOwnerBalance = await usdcToken.balanceOf(addr1.address);

  // Execute the abort campaign function
  await tokenMVP.connect(addr1).retakeInvestment(20000);

  //Get the addr1 balance after the transaction
  const finalOwnerBalance = await usdcToken.balanceOf(addr1.address);
    
  //The addr1 address final balance of USDC must be equal to the initial one plus the recently made repayment
  await expect(Number(initialOwnerBalance + 20000)).to.equal(finalOwnerBalance);

});

//TESTING CASE #9.2
it('Test #9.2 should not retake the invested funds because the amount is greater than invested funds', async function () {

  const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);

  // Execute the abort campaign function
  await tokenMVP.connect(owner).abortCampaign();

  // Execute the retake funds function
  await expect( tokenMVP.connect(addr1).retakeInvestment(21000))
    .to.be.revertedWith('Amount to withdraw must be greater than 10 USD and less than balance of investor');

});


//TESTING CASE #9.2
it('Test #9.2 should not retake the invested funds because the requester did not invest in the campaign', async function () {

  const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);

  // Execute the abort campaign function
  await tokenMVP.connect(owner).abortCampaign();

  // Execute the retake funds function
  await expect( tokenMVP.connect(addr3).retakeInvestment(100))
    .to.be.revertedWith('Amount to withdraw must be greater than 10 USD and less than balance of investor');

});

//TESTING CASE #9.2
it('Test #9.2 should not retake the invested funds because the campaign is not in ABORTED phase', async function () {

  const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);


  // Execute the retake funds function
  await expect( tokenMVP.connect(addr1).retakeInvestment(1000))
    .to.be.revertedWith('The campaign is not in aborted phase');

});

});




describe("Test #10. Attempt to extract funds in a malicious way", function () {
 
  //Create fixture to deploy smart contract and set initial variables
  async function deployContractAndSetVariables() {

  //Get signers (accounts) that will be testing the smart contract functions
  const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

  // Deploy a simple ERC20 token contract to simulate USDC
  const ERC20TokenUSDC = await ethers.getContractFactory('ERC20TokenUSDC');
  const usdcToken = await ERC20TokenUSDC.connect(addr1).deploy();

  //Asociate the smart contract with its name in the context
  const TokenMVP = await ethers.getContractFactory('TokenMVP');

  //Deploy smart contract with stablished parameters
  const tokenMVP = await TokenMVP.deploy(50000, 15, 1, 12, 60, "E-commerce", "Expansion", usdcToken.address);

  //Change the phase of the campaign to start the funding
  await tokenMVP.startFunding();

  // Mint USDC tokens to the addr1 account
  await usdcToken.connect(addr1).mint(addr1.address, 20000);
  // Approve the token transfer from addr1 to tokenMVP contract
  await usdcToken.connect(addr1).approve(tokenMVP.address, 20000);

  // Mint USDC tokens to the addr2 account
  await usdcToken.connect(addr1).mint(addr2.address, 10000);
  // Approve the token transfer from addr2 to tokenMVP contract
  await usdcToken.connect(addr2).approve(tokenMVP.address, 10000);


  // Deposit the investment of USDC tokens from the investor account "addr1" to the smart contract
  await tokenMVP.connect(addr1).depositInvestment(20000);
  // Deposit the investment of USDC tokens from the investor account "addr2" to the smart contract
  await tokenMVP.connect(addr2).depositInvestment(10000);


  //Return values as fixture for the testing cases
  return { tokenMVP, owner, addr1, addr2, addr3, addr4, usdcToken};

}

//TESTING CASE #9
it('Test #9. should retake the invested funds of an aborted campaign for addr1', async function () {

  const { tokenMVP, owner, addr1, addr2, addr3, usdcToken} = await loadFixture(deployContractAndSetVariables);

  // Execute the abort campaign function
  await tokenMVP.connect(owner).abortCampaign();

  //Get the addr1 balance before the transaction
  const initialOwnerBalance = await usdcToken.balanceOf(addr1.address);

  // Execute the abort campaign function
  await tokenMVP.connect(addr1).retakeInvestment(20000);

  //Get the addr1 balance after the transaction
  const finalOwnerBalance = await usdcToken.balanceOf(addr1.address);
    
  //The addr1 address final balance of USDC must be equal to the initial one plus the recently made repayment
  await expect(Number(initialOwnerBalance + 20000)).to.equal(finalOwnerBalance);

});

});
