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

import Router from 'next/router'
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

  const [Token_Name,set_Token_Name]=useState("");

  function update_Token_Name(text) {
    set_Token_Name(text);
  }

  const [Total_Supply,set_Total_Supply]=useState();

  function update_Total_Supply(text) {
    set_Total_Supply(text);
  }


  const [Token_Symbol,set_Token_Symbol]=useState("");

  function update_Token_Symbol(text) {
    set_Token_Symbol(text);
  }

  
  const [Decimal_Points,set_Decimal_Points]=useState();

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

let [Token_address,set_Token_address]=useState("");
let [Voting_address,set_Voting_address]=useState("");
let [Safe_address,set_Safe_address]=useState("");



  let deployed_Quadratic_Voting_Contract = {};
  let deployed_Gated_Voting_Contract = {};



  let all_deployed = true;
    function send_data(){
  
  
    if (all_deployed == true){
  
      Router.push({
        pathname: "/dashboard",
        query: { safe_address_share: Safe_address,
                 Token_address_share: Token_address,
                 Voting_address_share: Voting_address,
                 Token_Name_share: Token_Name,
                 Total_Supply_share: Total_Supply,
                 Token_Symbol_share: Token_Symbol,
                 Decimal_Points_share: Decimal_Points
                 }
    })
  }
    
     }


  const Create_Safe = async () => {
    try {


      const signer = await getProviderOrSigner(true);


      // Create EthAdapter instance
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer
      })

      const safeFactory = await SafeFactory.create({ ethAdapter })

      console.log("safeFactory before",safeFactory);

      const safeAccountConfig = {
        owners: [Distribution_address_1,Distribution_address_2,Distribution_address_3],
        threshold: 2
      }

      const safeDeploymentConfig = {
        saltNonce: Date.now().toString()
      }

      const predictedDeployAddress = await safeFactory.predictSafeAddress({
        safeAccountConfig,
        safeDeploymentConfig
      })


      function callback(txHash) {
        console.log('Transaction hash:', txHash)
      }

      const safe = await safeFactory.deploySafe({
        safeAccountConfig,
        safeDeploymentConfig,
        callback
      })

      
      await set_Safe_address(safe.getAddress());
      console.log('Deployed Safe:', safe.getAddress());
      console.log();


  
  } catch (err) {
    console.error(err);
  }
  };
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

 
  /**
   * addAddressToWhitelist: Adds the current connected address to the whitelist
   */
  const deploycontracts = async () => {
    try {

      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);

      let total_distribution = Number(Distribution_amount_1)+Number(Distribution_amount_2)+ Number(Distribution_amount_3);
      console.log("total_distribution",total_distribution);
      console.log("Total_Supply",Total_Supply);
      if (Token_Type == "ERC-721" &  Voting_Type == "Quadratic Voting") 
      {
        set_Configuration_Message("Invalid Configuration");
      }
      else{
      if(total_distribution<=Total_Supply){
          setLoading(true);
        if(Token_Type == "ERC-20"){


          var factory = new ethers.ContractFactory(abi_Token_Factory, bytecode_Token_Factory, signer);
          var deployed_Token_Factory_Contract = await factory.deploy(Total_Supply,Token_Name,Decimal_Points,Token_Symbol);
          await deployed_Token_Factory_Contract.deployTransaction.wait();




          console.log("Token_Factory Contract Address:", deployed_Token_Factory_Contract.address);
          set_Token_address(deployed_Token_Factory_Contract.address);

 

        }
        else if (Token_Type == "ERC-721"){

          var NFT_Marketplace_Contract = new ethers.ContractFactory(abi_NFT_Marketplace,bytecode_NFT_Marketplace,signer);

          var deployed_NFT_Marketplace_Contract = await NFT_Marketplace_Contract.deploy(Token_Name,Token_Symbol);

          await deployed_NFT_Marketplace_Contract.deployTransaction.wait();
          console.log("NFT_Marketplace Contract Address:", deployed_NFT_Marketplace_Contract.address);

          set_Token_address(deployed_NFT_Marketplace_Contract.address);

        }
        if (Voting_Type == "Quadratic Voting"){

          var Quadratic_Voting_Contract = new ethers.ContractFactory(abi_quadratic_voting,bytecode_quadratic_voting,signer);

          let deployed_Quadratic_Voting_Contract = await Quadratic_Voting_Contract.deploy(deployed_Token_Factory_Contract.address,100);
          await deployed_Quadratic_Voting_Contract.deployTransaction.wait();
          console.log("Qudratic voting Contract Address:", deployed_Quadratic_Voting_Contract.address);
          set_Voting_address(deployed_Quadratic_Voting_Contract.address);


        }
        else if(Voting_Type == "Gated voting"){

          var Gated_Voting_Contract = new ethers.ContractFactory(abi_Voting,bytecode_Voting,signer);

          if (Token_Type == "ERC-20"){
            deployed_Gated_Voting_Contract = await Gated_Voting_Contract.deploy(deployed_Token_Factory_Contract.address,100);
          }else if (Token_Type == "ERC-721"){
            deployed_Gated_Voting_Contract = await Gated_Voting_Contract.deploy(deployed_NFT_Marketplace_Contract.address,1);

          }



          await deployed_Gated_Voting_Contract.deployTransaction.wait();
          set_Voting_address(deployed_Gated_Voting_Contract.address);
          console.log("Gated voting Contract Address:", deployed_Gated_Voting_Contract.address);
        }


        if(Token_Type == "ERC"){
        const MembershipContract = new Contract(
          deployed_Token_Factory_Contract.address,
          abi_Token_Factory,
          signer
        );  

        var tx1 = await MembershipContract.Intial_Assigment(Distribution_address_1,Distribution_amount_1,
          Distribution_address_2,Distribution_amount_2,
          Distribution_address_3,Distribution_amount_3);
        }


    }
    else{
      set_Configuration_Message("Token Distribution exceeds Total supply");
    }
    }
      




      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
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

  /*
    renderButton: Returns a button based on the state of the dapp  deploycontracts(); 
  */
  const renderButton = () => {
    if (walletConnected) {
      if (loading) {
        return <div >Loading...</div>;
      } else {
        return (
          <div onClick={() => { Create_Safe(); } } >
            Generate DAO
          </div>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} >
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
  


  <div class="container text-center">
        <div class="row">
        <div class="col-2">
          
          
          <button type="button" class="btn btn-primary position-relative">
        {renderButton()} <span class="position-absolute top-0 start-100 translate-middle  border-light  p-2"><span class="visually-hidden">unread messages</span></span>
        </button>         
          
          
          </div>
        <div class="col-10"><h1><ul>


        <button type="button" class="btn btn-primary position-relative">
        <Link href="/dashboard" onClick={send_data}>Dashboard</Link> <span class="position-absolute top-0 start-100 translate-middle  border-light  p-2"><span class="visually-hidden">unread messages</span></span>
        </button>
          
          



          </ul></h1></div>

        </div>
      </div>



  





  </div>


      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous" async></script>


    </div>
  );
}