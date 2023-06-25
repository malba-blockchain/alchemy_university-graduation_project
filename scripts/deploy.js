// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const contractName = "TokenMVP";

async function main() {
  const TokenMVP = await hre.ethers.getContractFactory(contractName);
  // if you need to add constructor arguments for the particular game, add them here:
  //PARAMETERS: Investment goal, interest rate, payment frequency (0:montly - 1: bymonthly - 2:quarterly)
  //total repayments, repayment grace period, industry, category
  const tokenMVP = await TokenMVP.deploy(50000, 15, 1, 12, 60, "E-commerce", "Expansion");
  console.log(`${contractName} deployed to address: ${tokenMVP.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
