const { ethers } = require("hardhat");

module.exports = {ethers};

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */
  const GnosisSafeContract = await ethers.getContractFactory("GnosisSafeProxyFactory");

  // here we deploy the contract
  const deployedGnosisSafeContract = await GnosisSafeContract.deploy();//"0x3E5c63644E683549055b9Be8653de26E0B4CD36E");
  // 10 is the Maximum number of whitelisted addresses allowed

  // Wait for it to finish deploying
  await deployedGnosisSafeContract.deployed();

  // print the address of the deployed contract
  console.log("Gnosis Safe Contract Address:", deployedGnosisSafeContract.address);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });