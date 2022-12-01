import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { VOTING_CONTRACT_ADDRESS } from "../constants";
import { MEMBERSHIP_CONTRACT_ADDRESS } from "../constants";
import {abi as abi_Token_Factory } from "../artifacts/contracts/Token_Factory.sol/Token_Factory.json";
import {abi as abi_quadratic_voting} from "../artifacts/contracts/QuadraticVoting_Simple.sol/QuadraticVoting_Simple.json";
import {abi as abi_NFT_Marketplace } from "../artifacts/contracts/NFT_MarketPlace.sol/NFT_Marketplace.json";
import {abi as abi_Voting} from "../artifacts/contracts/Voting.sol/One_to_one_Voting.json";
//import '@nomiclabs/hardhat-ethers';
import { ethers } from "ethers";
//import { run } from "node:test";
//import {deployquadraticvoting} from "../scripts/deploy_Quadratic_Voting"
//import {deploytokenfactory} from "../scripts/deploy_Token_Factory"
import {bytecode as bytecode_Token_Factory} from "../artifacts/contracts/Token_Factory.sol/Token_Factory.json";
import {bytecode as bytecode_quadratic_voting} from "../artifacts/contracts/QuadraticVoting_Simple.sol/QuadraticVoting_Simple.json";
import {bytecode as bytecode_NFT_Marketplace } from "../artifacts/contracts/NFT_MarketPlace.sol/NFT_Marketplace.json";
import {bytecode as bytecode_Voting} from "../artifacts/contracts/Voting.sol/One_to_one_Voting.json";
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
  const [loading_voting, setLoading_voting] = useState(false);
  // numberOfWhitelisted tracks the number of addresses's whitelisted
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  const [Configuration_Message,set_Configuration_Message]=useState(" ");

  const [Token_Name,set_Token_Name]=useState("No Name");

  function update_Token_Name(text) {
    set_Token_Name(text);
  }

  const [Total_Supply,set_Total_Supply]=useState(100);

  function update_Total_Supply(text) {
    set_Total_Supply(text);
  }


  const [Token_Symbol,set_Token_Symbol]=useState("TKN");

  function update_Token_Symbol(text) {
    set_Token_Symbol(text);
  }

  
  const [Decimal_Points,set_Decimal_Points]=useState(1);

  function update_Decimal_Points(text) {
    set_Decimal_Points(text);
  }

  const [Token_Type,set_Token_Type]=useState("ERC-20");
  const [Voting_Type,set_Voting_Type]=useState("Quadratic Voting");


  function Update_Selection() {
    let selectElement1 = document.querySelector('#select1');
    let output1 = selectElement1.value;
    let selectElement2 = document.querySelector('#select2');
    let output2 = selectElement2.value;
    set_Token_Type(output1);
    set_Voting_Type(output2);
    if (output1 == "ERC-721" & output2 == "Quadratic Voting"){
      set_Configuration_Message(" Invalid Configuration");
      
    }
    else{
      set_Configuration_Message(" Correct Configuration");
    }
    
}

const [Distribution_address_1,set_Distribution_address_1]=useState(" ");
const [Distribution_address_2,set_Distribution_address_2]=useState(" ");
const [Distribution_address_3,set_Distribution_address_3]=useState(" ");

const [Distribution_amount_1,set_amount_address_1]=useState(0);
const [Distribution_amount_2,set_amount_address_2]=useState(0);
const [Distribution_amount_3,set_amount_address_3]=useState(0);

const [Token_address,set_Token_address]=useState("");
const [Voting_address,set_Voting_address]=useState("");

  // POC
  let  Membership_modules  = ["Token Factory", "NFT Membership"];
  let  Membership_module = "Token Factory";
  let  Voting_modules  = ["one to one voting", "Qudratic voting"];
  let  Voting_module = "Qudratic voting";

  let deployed_Quadratic_Voting_Contract = {};
  let deployed_Gated_Voting_Contract = {};



  const [Proposal_title,set_Proposal_title]=useState("");
  const [Proposal_description,set_Proposal_description]=useState("");
  const [Proposal_no_for_viewing,set_Proposal_no_for_viewing]=useState(1);

  const [Proposal_number,set_Proposal_number]=useState(0);
  const [Voting_decision,set_Voting_decision]=useState(1);
  const [vote_weight,set_vote_weight]=useState(1);

  const [Create_Proposal_title,set_Create_Proposal_title]=useState("");
  const [Create_Proposal_description,set_Create_Proposal_description]=useState("");

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
      window.alert("Change the network to goerli");
      throw new Error("Change network to goerli");
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
      let wallet = new ethers.Wallet("0x07b35804736c3a8229a5883574637e3dad174838d67f633b88f69e2b7e0b1d8d", provider); 

      //let deployed_Token_Factory_Contract;
      //let deployed_NFT_Marketplace_Contract;
      let total_distribution = Distribution_amount_1+Distribution_amount_2;
      total_distribution = total_distribution + Distribution_amount_3;
      console.log("total_distribution",total_distribution);
      console.log("Total_Supply",Total_Supply);
      if (Token_Type == "ERC-721" &  Voting_Type == "Quadratic Voting") 
      {
        set_Configuration_Message("Invalid Configuration");
      }
      else{
        //if(total_distribution<=Total_Supply){
        setLoading(true);
      if(Token_Type == "ERC-20"){

        var Token_Factory_Contract = new ethers.ContractFactory(abi_Token_Factory,bytecode_Token_Factory,wallet);

        var deployed_Token_Factory_Contract = await Token_Factory_Contract.deploy(Total_Supply,Token_Name,Decimal_Points,Token_Symbol);
        await deployed_Token_Factory_Contract.deployed();
        console.log("Token_Factory Contract Address:", deployed_Token_Factory_Contract.address);
        set_Token_address(deployed_Token_Factory_Contract.address);

 

      }
      else if (Token_Type == "ERC-721"){

        var NFT_Marketplace_Contract = new ethers.ContractFactory(abi_NFT_Marketplace,bytecode_NFT_Marketplace,wallet);

        var deployed_NFT_Marketplace_Contract = await NFT_Marketplace_Contract.deploy();
        await deployed_NFT_Marketplace_Contract.deployed();
        console.log("NFT_Marketplace Contract Address:", deployed_NFT_Marketplace_Contract.address);

        set_Token_address(deployed_NFT_Marketplace_Contract.address);

      }
      if (Voting_Type == "Quadratic Voting"){

        var Quadratic_Voting_Contract = new ethers.ContractFactory(abi_quadratic_voting,bytecode_quadratic_voting,wallet);

        let deployed_Quadratic_Voting_Contract = await Quadratic_Voting_Contract.deploy(deployed_Token_Factory_Contract.address,100);
        await deployed_Quadratic_Voting_Contract.deployed();
        //SetMembershipOption(deployed_Quadratic_Voting_Contract.address);
        console.log("Qudratic voting Contract Address:", deployed_Quadratic_Voting_Contract.address);
        set_Voting_address(deployed_Quadratic_Voting_Contract.address);


      }
      else if(Voting_Type == "Gated voting"){

        var Gated_Voting_Contract = new ethers.ContractFactory(abi_Voting,bytecode_Voting,wallet);

        if (Token_Type == "ERC-20"){
          deployed_Gated_Voting_Contract = await Gated_Voting_Contract.deploy(deployed_Token_Factory_Contract.address,100);
        }else if (Token_Type == "ERC-721"){
          deployed_Gated_Voting_Contract = await Gated_Voting_Contract.deploy(deployed_NFT_Marketplace_Contract.address,1);
          
        }
        


        await deployed_Gated_Voting_Contract.deployed();
        set_Voting_address(deployed_Gated_Voting_Contract.address);
        //SetMembershipOption(deployed_Quadratic_Voting_Contract.address);
        console.log("Gated voting Contract Address:", deployed_Gated_Voting_Contract.address);
      }


      if(Token_Type == "ERC-20"){
      const MembershipContract = new Contract(
        deployed_Token_Factory_Contract.address,
        abi_Token_Factory,
        signer
      );  

      var tx1 = await MembershipContract.Intial_Assigment(Distribution_address_1,Distribution_amount_1,
        Distribution_address_2,Distribution_amount_2,
        Distribution_address_3,Distribution_amount_3);
      }


   // }
    //else{
    //  set_Configuration_Message("Token Distribution exceeds Total supply");
    //}
    }
      



      // call the addAddressToWhitelist from the contract
      ////const tx = await VotingContract.addAddressToWhitelist();

      // wait for the transaction to get mined
      //await tx.wait();
      setLoading(false);
      // get the updated number of addresses in the whitelist
      ////await getNumberOfWhitelisted();
      ////setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };

  
  const CreateProposalcontracts = async () => {
    try {

      const provider = await getProviderOrSigner();
      const signer = await getProviderOrSigner(true);

      //console.log("deployed_Quadratic_Voting_Contract.address",Voting_address);

      const VotingContract = new Contract(
        Voting_address,
        abi_quadratic_voting,
        signer
      );  

      var tx1 = await VotingContract.createItem(Create_Proposal_title,"vote on it",Create_Proposal_description);


    } catch (err) {
      console.error(err);
    }
  };



  const ViewProposalcontracts = async () => {
    try {

      const provider = await getProviderOrSigner();
      const signer = await getProviderOrSigner(true);

      //console.log("deployed_Quadratic_Voting_Contract.address",Voting_address);

      const VotingContract = new Contract(
        Voting_address,
        abi_quadratic_voting,
        signer
      );  
      ///////////////////////Proposal_no_for_viewing
      var Proposal = await VotingContract.items(Proposal_no_for_viewing);
      console.log(Proposal);
      set_Proposal_title(Proposal.title);
      set_Proposal_description(Proposal.description);

    } catch (err) {
      console.error(err);
    }
  };



  const Votecontracts = async () => {
    try {


      const provider = await getProviderOrSigner();
      const signer = await getProviderOrSigner(true);

      //console.log("deployed_Quadratic_Voting_Contract.address",Voting_address);

      const VotingContract = new Contract(
        Voting_address,
        abi_quadratic_voting,
        signer
      );  

      if (Voting_decision == 1){
        var item = await VotingContract.positiveVote(Proposal_number,vote_weight);
      }else if(Voting_decision == 2){
        var item = await VotingContract.negativeVote(Proposal_number,vote_weight);
      }
  
  console.log(item);

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
            Generate DAO
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


  const renderButton_Create_Proposal = () => {
    if (walletConnected) {
      if (loading_voting) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={ CreateProposalcontracts} className={styles.button}>
            Create Proposal
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
  

  const renderButton_ViewProposalcontracts = () => {
    if (walletConnected) {
      if (loading_voting) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={ ViewProposalcontracts} className={styles.button}>
            View the Proposal
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



  const renderButton_Voting = () => {
    if (walletConnected) {
      if (loading_voting) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={ Votecontracts} className={styles.button}>
            Vote on Proposal
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
  console.log("Simply");
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
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
 
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous"/>

        </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Excelsior Labs</h1>
          <div className={styles.description}>
            Select the modules to deploy your smart contract
          </div>

          <div>
          <p> Select Token Standard
          <select id="select1">
            <option value="ERC-20">ERC-20</option>
            <option value="ERC-721">ERC-721</option>
          </select>
            </p>
          </div>
          <div>
          <p> Select Voting Module
          <select id="select2">
            <option value="Gated voting">Gated voting</option>
            <option value="Quadratic Voting">Quadratic Voting</option>
          </select>
          </p>
          </div>
           <div>
            
              <button onClick={Update_Selection}>Check Configuration</button>
              <p>{Configuration_Message}</p>
           </div>

      


           <h3>Token Details</h3>
        
        <p>
      <div class="mb-3">
       <label for="exampleFormControlInput1" class="form-label">Token Name</label>
      <input onChange={(e) => update_Token_Name(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="Excelsior Labs"/>
     </div>
  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Token Symbol</label>
    <input onChange={(e) => update_Token_Symbol(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="EXL"/>
  </div>
  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Total Supply</label>
    <input onChange={(e) => update_Total_Supply(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="1,000,000"/>
  </div>
  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Decimal Points</label>
    <input onChange={(e) => update_Decimal_Points(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="6"/> 
  </div>
  
  <h3>Distribution</h3>
 
  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Distribution Address 1</label>
    <input onChange={(e) => set_Distribution_address_1(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="0x5045F03ab00f57982a7E564B068814d80091f92d"/>
  </div>
  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Number of Tokens</label>
    <input onChange={(e) => set_amount_address_1(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="250,000"/>
  </div>
  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Distribution Address 2</label>
    <input onChange={(e) => set_Distribution_address_2(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="0x5045F03ab00f57982a7E564B068814d80091f92d"/>
  </div>
  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Number of Tokens</label>
    <input onChange={(e) => set_amount_address_2(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="250,000"/>
  </div>
  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Distribution Address 3</label>
    <input onChange={(e) => set_Distribution_address_3(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="0x5045F03ab00f57982a7E564B068814d80091f92d"/>
  </div>
  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Number of Tokens</label>
    <input onChange={(e) => set_amount_address_3(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="250,000"/>
  </div>
  </p>
  

  {renderButton()}

<div>Token contract address:{Token_address}</div>
<div>Voting contract address:{Voting_address}</div>



<h2>Voting Forum</h2>
<h3>Proposal creation</h3>
<div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Enter Proposal Title</label>
    <input onChange={(e) => set_Create_Proposal_title(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="1"/>
  </div>

  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Enter Proposal Description</label>
    <input onChange={(e) => set_Create_Proposal_description(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="0"/>
  </div>



  {renderButton_Create_Proposal()}

  <h3>View Proposal</h3>
  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Proposal Number</label>
    <input onChange={(e) => set_Proposal_no_for_viewing(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="1"/>
  </div>
  <p>Title:{Proposal_title}</p>
  <p>Description:{Proposal_description}</p>
  {renderButton_ViewProposalcontracts()}
  <h3>Vote on a Proposal</h3>

  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Proposal Number</label>
    <input onChange={(e) => set_Proposal_number(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="1"/>
  </div>

  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">Decision</label>
    <input onChange={(e) => set_Voting_decision(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="0"/>
  </div>
  <div class="mb-3">
    <label for="exampleFormControlInput1" class="form-label">No of token</label>
    <input onChange={(e) => set_vote_weight(e.target.value)} type="email" class="form-control" id="exampleFormControlInput1" placeholder="1"/>
  </div>
  {renderButton_Voting()}
  </div>

      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>


    </div>
  );
}