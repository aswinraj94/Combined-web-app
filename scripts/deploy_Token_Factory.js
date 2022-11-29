const { ethers } = require("hardhat");

module.exports = {ethers};

async function deploytokenfactory() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */
  const Token_Factory_Contract = await ethers.getContractFactory("Token_Factory");

  // here we deploy the contract
  const deployed_Token_Factory_Contract = await Token_Factory_Contract.deploy(10000000,"Test_Token_Factory",1,"TTF");
  // 10 is the Maximum number of whitelisted addresses allowed

  // Wait for it to finish deploying
  await deployed_Token_Factory_Contract.deployed();

  // print the address of the deployed contract
  console.log("Token_Factory Contract Address:", deployed_Token_Factory_Contract.address);
  
  var fsp = require('fs/promises');
  await fsp.writeFile("constants/index_membership.js", "const TOKEN_FACTORY_CONTRACT_ADDRESS = "+'"'+ deployed_Token_Factory_Contract.address +'"'+ ";module.exports = { TOKEN_FACTORY_CONTRACT_ADDRESS };");
  

  //var path_relative ="Hardhat_Env/../../"
  //await fsp.writeFile(path_relative+"constants/index_voting.js", " export const VOTING_CONTRACT_ADDRESS = "+'"'+deployed_Token_Factory_Contract.address+'";');

  
}

// Call the main function and catch if there is any error
deploytokenfactory()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });