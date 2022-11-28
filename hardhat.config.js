require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const QUICKNODE_HTTP_URL = process.env.QUICKNODE_HTTP_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity:  {
    compilers: [
      {
        version: "0.8.9",
      },
      {
        version: "0.4.24",
        settings: {},
      },
      {
        version: "0.5.16",
        settings: {},
      },
      {
        version: "0.8.13",
      },
    ],
  },
  networks: {
    goerli: {
      url: QUICKNODE_HTTP_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};