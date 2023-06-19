Final project theme: Showing Smart Contract Functionality via Custom Unit Tests

Project Name: DeFi as a financing method for organizations. Real world asset tokenization.

Problem Description: In the LatAm region there are profitable and well stablished companies (SMEs) that require funding to be able to expand their operations or create new and more ambitious projects.

However, the only way they have to finance those projects (besides bootstapping or VC funding which implies equity dilution) is via the traditional financial system.

The Traditional financial system in the region has high entry barries, banks require a ton of burocratic and slow paperwork, it has unbearable high interest rates and due to the ammount of intermediaries and staff required to properly work, it also charges commissions that make infeasible most of the funding attempts made by (SMEs).



Problem solution: 

The following project attemps to solve that problem via the tokenization of debt based on a fixed rate and rates stablished by the issuer of the debt tokens (the company that borrows the funds).

The funds would be provided in a decentralized way by investors, individuals that could be organizations or persons who want to lend their money in exchange for an interest, just like any traditional model of borrowing.


The general idea of the solution is based on 3 main points, that go as follows:

1. The investors provide funds to a Project Campaing in a decentralized way via blockchain technology, through a smart contract and using stablecoins to decrease the volatility risk of the DeFi ecosystem. In exchange of their funds, investors recieve back tokens that represent their investment proportional to the funds they provided to the Project Campaing.

2. If the Project Campaing of the issuer was successfull (it achived the expected threshold) the funds go from the smart contract to a wallet where the issuer can use them, so it can be spent in the requirements to make the Project successful.

3. Once the Project starts generating revenue, the issuer will start repaying the debt and interests to the investors, based on the rules of the agreement stablished in the smart contract. The money will initially be transfered to the smart contract were dispersion of funds will occur to the wallets of investors in a periodic way.


Benefits of the solution:

1. Tokenized debt allows investors to get fast liquidity around their investments, giving the posibility to exchange and sell their tokens in the present to other investorss, instead of waiting for the issuer to repay the debt.

2. Smart contracts allow to decrese operational overload that traditional finance usually have, therefore this solution decreases the cost of loan access.

3. Usage of blockchain allows transparency and trust for investors that traditional organizations dont have.

4. Decentralized finance allows users to access global investment opportunities, traditional finance usually only gives access to this kind of investments to country based individuals.

5. Fixed rate instruments via tokenized assets are a solution to investors that can be part of the DeFi/Crypto ecosystem without taking the risk of cryptocurrency volatility

6. Investors can fund projects of the industries they like, even in their own region, and have now the possibility to contribute to the improvement of their local economies by the power of crowdfunding.

7. Organizations can have access to global liquidity, exposing their projects to the capital of international investors in the whole LatAm region looking for promising ventures.

8. The organization stablishes the interest rate based on the profitability of the project instead of being subject to the excesive rates of traditional finance


Detail of the solution:

At this point in time, there are two possible (and last resource) options to MITIGATE the risk of a default from the issuer. Each one of these solutions have intrinsic challenges that will be adressed in the future.

1. The debt will be collateralized by real world assets owned by the company like equity shares. This could be simmilar to the traditional private stock loan model, where a company borrows equity against its own private stock. In the case of default the investors 

2. The debt is not collateralized by equity shares but in the case of default from the issuer, the debt will be managed by a local collection company and the issuer will be reported to financial information centers, this negatively impacts the access to future obligations.


However the negative impact on investors of the default risk can also be PREVENTED and REDUCTED with the following points:

1. Due dilligence and background checks on the issuer before creating a Project Campaing
2. Investment diversification for the investors
3. Usage of collateral or TradFi methods to ensure payments
4. Delivery of funds to the issuer based on the achievement of milestones to guarantee the success of the project
5. Usage of on-chain insurance solutions
5. Waterfall model for investors, creating trenches of risks/ROI, based on the risk appetite of each investor


--------------DONE---------------

1. Use cases definition: The deployer of the smart contract can be the issuer.

1.1- Definition of parameters that the issuer will establish at the beginning of the creation of the smart contract
-builder function
MODIFIER:N/A
VALIDATIONS: name(>10 <40 lenght), symbol (>2 <4 lenght), decimals(integer), totalSupply(>1000), interestRate(>0), frequencyInterestPayments(1-#), frequencyPrincipalPayments(1-#), gracePeriodInterestPayments(1-#), gracePeriodPrincipalPayments(1-#), term(12-60), industry(not null), category(not null).

1.2- Start campaing - the issuer starts the campaing the date they want to with a simple click
MODIFIER: onlyOwner
VALIDATIONS: campaingStage(newCampaing)

1.3- Deposit of investment: Deposit of stablecoins by investors, to obtain security tokens in exchange to support the debt.
-For every 10 USD received by the smart contract, 1 token is registered in the mapping (addr-uint) of the token
MODIFIER: isInFundingStage
VALIDATIONS: msg.value(>10 USD TOKEN), msg.value(multiple of 10).

1.4- Validation of milestone by investors
-The issuer uploads evidence of its progress (off-chain) and investors vote to advance to the next milestone
MODIFIER: investorHasNoVotedYet
VALIDATIONS: isInValidationPhase, countVotes on stage = true > numberOfInvestors/2+1


1.5- Progressive withdraw of disbursement of invested funds to the issuer, based on validation of milestones. 3 phases.
-Fund disbursement function that is executed if the number of votes is sufficient
MODIFIER: onlyOwner
VALIDATIONS: isinWithdrawalPhase1-2-3, ammount to withdraw (>10 USD)


1.6- Receipt of debt payments from the issuer to the smart contract
-Once the issuer enters the debt payment phase, it is possible to make transfers to the smart contract to start paying the debt. The smart contract automatically assigns the balance to each investor address based on the number of tokens it owns.
MODIFIER: onlyOwner
VALIDATIONS: isInPaymentPhase, ammount to pay (>10 USD)


1.7- Dispersion of payments to each of the investors based on their contributions/tokens currently in possession
The user must enter the smart contract and make the payment claim to his address, making a token transaction
MODIFIER: 
VALIDATIONS: isInPaymentPhase, amount(>10 USD <balanceOfActualFunds)


1.8- Retake investment, withdraw the total of funds left in case the investors dont approve the next payment phase.
-In the case the number of votes doesnt reach the treshold for the next payment phase, investors can take back their funds as in the usual dispersion of payments, based on the amount of tokens they hold.

MODIFIER: 
VALIDATIONS: isInAbortedPhase, amount(>10 <balanceOfActualFunds)


2. Use class diagram to represent design

3. Define the visibility for the state variables and functions

4. Define access modifiers for the functions

5. Define validations for input variables of the functions

6. Define conditions that must hold true


7. Define flux state diagrams https://www.researchgate.net/figure/UML-class-diagram-representing-ARC-721_fig4_359735111

7.1-Issuer creates campaing
Issuer adds all the information to the smart contract

7.2-Issuer starts campaing
Issuer executes startFunding function

7.3-Investor deposits investment
Investor executes deposit investment function with the value that wants to deposit

7.4-Investor validates milestone
Investor executes validate milestone function

7.5-Issuer withdraws funds of milestone
Issuer executes withdrawFundsOfMilestone function with the required amount

7.6-Issuer pays debt based on periodicity
Issuer executes payDebt function with the expected amount based on periodicity and rates

7.7-Investor withdraws payments
Investor executes withdrawPaymentsToInvestor with the required amount to retire

7.8-Investor retakes investment
Investor executes retake investment function to withdraw all the funds asociated to his account


8. Define main summary diagram of the protocol
-Backers
-Investors
-Issuers
-Platform
-Campaing
-Pool

--------------ToDo---------------

7. Express conditions that were discovered

Token ERC-721 


8. Program