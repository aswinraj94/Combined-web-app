import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { VOTING_CONTRACT_ADDRESS } from "../constants";
import { MEMBERSHIP_CONTRACT_ADDRESS } from "../constants";
import {abi as abi_Token_Factory } from "../artifacts/contracts/Token_Factory.sol/Token_Factory.json";
import {abi as abi_quadratic_voting} from "../artifacts/contracts/QuadraticVoting_Simple.sol/QuadraticVoting_Simple.json";
//import '@nomiclabs/hardhat-ethers';
import { ethers } from "ethers";
//import { run } from "node:test";
//import {deployquadraticvoting} from "../scripts/deploy_Quadratic_Voting"
//import {deploytokenfactory} from "../scripts/deploy_Token_Factory"
import {bytecode as bytecode_Token_Factory} from "../artifacts/contracts/Token_Factory.sol/Token_Factory.json";
import {bytecode as bytecode_quadratic_voting} from "../artifacts/contracts/QuadraticVoting_Simple.sol/QuadraticVoting_Simple.json";
//import { ContractFactory } from 'ethers'
//const ethers = require('ethers');
//const fs = require('fs');
//import {ethers} from "../scripts/deploy_Token_Factory"

//const { ethers } = require("hardhat");
 
export default function Home() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // joinedWhitelist keeps track of whether the current metamask address has joined the Whitelist or not
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  // numberOfWhitelisted tracks the number of addresses's whitelisted
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  const [Token_Name,set_Token_Name]=useState("No Name");

  function update_Token_Name(text) {
    set_Token_Name(text);
  }

  const [Total_Supply,set_Total_Supply]=useState(100);

  function update_Total_Supply(text) {
    set_Total_Supply(text);
  }

  update_Total_Supply

  // POC
  let  Membership_modules  = ["Token Factory", "NFT Membership"];
  let  Membership_module = "Token Factory";
  let  Voting_modules  = ["one to one voting", "Qudratic voting"];
  let  Voting_module = "Qudratic voting";




  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  /**
   * addAddressToWhitelist: Adds the current connected address to the whitelist
   */
  const deploycontracts = async () => {
    try {
      //SetMembershipOption("Membership_modules");
      // We need a Signer here since this is a 'write' transaction.
      const provider = await getProviderOrSigner();
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods


      //require("dotenv").config({ path: "../.env" });
      //const { TOKEN_FACTORY_CONTRACT_ADDRESS } = require("../constants/index_membership.js");
      //SetMembershipOption("Non_Member");
 
      //if(Membership_module == "Token Factory"){
        //await run(npx hardhat run scripts/deploy.js --network goerli);
        //let val = deploytokenfactory();
        //const provider = ethers.getDefaultProvider();
        //let httpProvider = new ethers.providers.JsonRpcProvider();

        //let url = "https://goerli.infura.io/v3/a220f85f3fcd40eea9883dfcb4aa6236";
        //let customHttpProvider = new ethers.providers.InfuraProvider(url);
        //const provider = new ethers.providers.JsonRpcProvider('https://long-tame-pallet.ethereum-goerli.discover.quiknode.pro/8faecb4ee1439b89a204628838536c5d85079c31/');
        //const provider = new ethers.providers.InfuraProvider('https://goerli.infura.io/v3/a220f85f3fcd40eea9883dfcb4aa6236');
        //const provider = new ethers.providers.JsonRpcProvider();
        //let provider = new ethers.getDefaultProvider();

        let wallet = new ethers.Wallet("0x07b35804736c3a8229a5883574637e3dad174838d67f633b88f69e2b7e0b1d8d", provider);

        SetMembershipOption(Token_Name);
        const Token_Factory_Contract = new ethers.ContractFactory(abi_Token_Factory,bytecode_Token_Factory,wallet);
        const Quadratic_Voting_Contract = new ethers.ContractFactory(abi_quadratic_voting,bytecode_quadratic_voting,wallet);

        const deployed_Token_Factory_Contract = await Token_Factory_Contract.deploy(Total_Supply,Token_Name,1,"TTF");
        await deployed_Token_Factory_Contract.deployed();
        console.log("Token_Factory Contract Address:", deployed_Token_Factory_Contract.address);
 
        SetMembershipOption(deployed_Token_Factory_Contract.address);

        const deployed_Quadratic_Voting_Contract = await Quadratic_Voting_Contract.deploy(deployed_Token_Factory_Contract.address,100);
        await deployed_Quadratic_Voting_Contract.deployed();
        SetMembershipOption(deployed_Quadratic_Voting_Contract.address);
        console.log("Qudratic voting Contract Address:", deployed_Quadratic_Voting_Contract.address);
      //}
      if (Voting_module == "Qudratic voting"){

      }
      
      const MembershipContract = new Contract(
        deployed_Quadratic_Voting_Contract.address,
        abi_Token_Factory,
        signer
      );
      const VotingContract = new Contract(
        deployed_Token_Factory_Contract.address,
        abi_quadratic_voting,
        signer
      );  
      // call the addAddressToWhitelist from the contract
      ////const tx = await VotingContract.addAddressToWhitelist();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      // get the updated number of addresses in the whitelist
      ////await getNumberOfWhitelisted();
      ////setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };

  

  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);

      //checkIfAddressInWhitelist();
      //getNumberOfWhitelisted();
    } catch (err) {
      console.error(err);
    }
  };

  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
    if (walletConnected) {
      if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={ deploycontracts} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

///Recommendation


//let  Membership_modules : string[] = ["Token Factory", "NFT Membership"];
const [MembershipOption, SetMembershipOption] = useState(["Token Factory"]);
const [searchText, setSearchText] = useState("");

useEffect(() => {

}, [MembershipOption]);


function SelectMembership() {
  var index=0;
  var Membership_module = Membership_modules[index];
  SetMembershipOption(Membership_modules);
}

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
        
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Excelsior Labs</h1>
          <div className={styles.description}>
            Select the modules to deploy your smart contract
          </div>


           <div>
            <p>{MembershipOption}</p>
              <button onClick={SelectMembership}>Select</button>
           </div>



          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>


        <div>
      <input type="Token Name" onChange={(e) => update_Token_Name(e.target.value)} />
      </div>
      <div>
      <input type="Total Supply" onChange={(e) => update_Total_Supply(e.target.value)} />
      </div>




        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}