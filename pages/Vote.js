import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from 'next/link'
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";

import {abi as abi_Token_Factory } from "../artifacts/contracts/Token_Factory.sol/Token_Factory.json";
import {abi as abi_quadratic_voting} from "../artifacts/contracts/QuadraticVoting_Simple.sol/QuadraticVoting_Simple.json";
import {abi as abi_NFT_Marketplace } from "../artifacts/contracts/NFT_MarketPlace.sol/NFT_Marketplace.json";
import {abi as abi_Voting} from "../artifacts/contracts/Voting.sol/One_to_one_Voting.json";

import { ethers } from "ethers";

import {bytecode as bytecode_Token_Factory} from "../artifacts/contracts/Token_Factory.sol/Token_Factory.json";
import {bytecode as bytecode_quadratic_voting} from "../artifacts/contracts/QuadraticVoting_Simple.sol/QuadraticVoting_Simple.json";
import {bytecode as bytecode_NFT_Marketplace } from "../artifacts/contracts/NFT_MarketPlace.sol/NFT_Marketplace.json";
import {bytecode as bytecode_Voting} from "../artifacts/contracts/Voting.sol/One_to_one_Voting.json";



import Safe, { SafeFactory, SafeAccountConfig } from '@safe-global/safe-core-sdk'


import EthersAdapter from '@safe-global/safe-ethers-lib'

 
export default function Home() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);

  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  const [loading_voting, setLoading_voting] = useState(false);

  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  const [Configuration_Message,set_Configuration_Message]=useState(" ");






const [Distribution_address_1,set_Distribution_address_1]=useState(" ");
const [Distribution_address_2,set_Distribution_address_2]=useState(" ");
const [Distribution_address_3,set_Distribution_address_3]=useState(" ");

const [Distribution_amount_1,set_amount_address_1]=useState(0);
const [Distribution_amount_2,set_amount_address_2]=useState(0);
const [Distribution_amount_3,set_amount_address_3]=useState(0);

const [Token_address,set_Token_address]=useState("");
const [Voting_address,set_Voting_address]=useState("");
const [Safe_address,set_Safe_address]=useState("");

  // POC

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


  //////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    // If user is not connected to the polygon network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 137) {
      window.alert("Change the network to polygon");
      throw new Error("Change network to polygon");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };






  
  const CreateProposalcontracts = async () => {
    try {

      const provider = await getProviderOrSigner();
      const signer = await getProviderOrSigner(true);


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

    } catch (err) {
      console.error(err);
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



  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "polygon",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
      <title>Excelsior Labs</title>
        <meta name="description" content="Excelsior-Labs" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
 
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous"/>

        </Head>

      <div className={styles.main}>
        <div>

          

      <ul>

      <button className={styles.button}><Link href="/dashboard">Return to Dashboard</Link></button>

       </ul>



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

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous" async></script>


    </div>
  );
}