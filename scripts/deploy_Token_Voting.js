const { ethers } = require("hardhat");

module.exports = {ethers};

async function deploytokenfactory() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */
  const Voting_Contract = await ethers.getContractFactory("One_to_one_Voting");

  // here we deploy the contract
  const deployed_Voting_Contract = await Voting_Contract.deploy("0x546eb79AF3085637ddd4DACC1d70a4b2103EE5cE",1);
  // 10 is the Maximum number of whitelisted addresses allowed

  // Wait for it to finish deploying
  await deployed_Voting_Contract.deployed();

  // print the address of the deployed contract
  console.log("Token_Factory Contract Address:", deployed_Voting_Contract.address);
  

}

// Call the main function and catch if there is any error
deploytokenfactory()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });