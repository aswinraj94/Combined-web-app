import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from 'next/link'
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
//import {Token_Name,Total_Supply,Token_Symbol } from "./index.js"
//import {Decimal_Points,Token_address,Voting_address } from "./index.js"

import { useRouter } from "next/router";

import { useSafeAdd,useVoting,useMembership } from '../lib/ThemeContext'
import { useTokenName,useTokenSymbol,useTotalSupply,useDecimalPoint } from '../lib/ThemeContext'
 
export default function Home() {

  const { TokenName, setTokenName } = useTokenName()
  const { TokenSymbol, setTokenSymbol} = useTokenSymbol()
  const { TotalSupply, setTotalSupply} = useTotalSupply()
  const { DecimalPoint, setDecimalPoint } = useDecimalPoint()

  const { SafeAdd, setSafeAdd } = useSafeAdd()
  const { Voting, setVoting } = useVoting()
  const { Membership , setMembership  } = useMembership()
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);

  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  const router = useRouter();

  let Token_Name = "";
  let Total_Supply = "";
  let Token_Symbol = "";
  let Decimal_Points = "";

  let Token_address = "";
  let Voting_address = "";
  let safe_address = "";



  const {
    query :{safe_address_share,
      Token_address_share,
      Voting_address_share,
      Token_Name_share,
      Total_Supply_share,
      Token_Symbol_share,
      Decimal_Points_share
    }
  } = router

  const props = {
    safe_address_share,
    Token_address_share,
    Voting_address_share,
    Token_Name_share,
    Total_Supply_share,
    Token_Symbol_share,
    Decimal_Points_share
  }

let intial_load = true;

  async function store_values(){

    
  Token_Name = props.Token_Name_share;
  Total_Supply = props.Total_Supply_share;
  Token_Symbol = props.Token_Symbol_share;
  Decimal_Points = props.Decimal_Points_share;

  Token_address = props.Token_address_share;
  Voting_address = props.Voting_address_share;
  safe_address = props.safe_address_share;


  };



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
    if (chainId !== 80001) {
      console.log(props.address);
      window.alert("Change the network to polygon");
      throw new Error("Change network to polygon");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
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
  
          <div className={styles.title}>
          <h3> DAO Dashboard</h3> 
          </div>

           <h3>Token Details</h3>
        
           <div>Token Name:{TokenName}</div>
           <div>Token Total Supply:{TokenSymbol}</div>
           <div>Token Symbol:{TotalSupply}</div>
           <div>Token Decimal Points:{DecimalPoint}</div>

           <h3>Contract address</h3>

<div>Token contract address:{Membership}</div>
<div>Voting contract address:{Voting}</div>
<div>Gnosis Safe contract address:{SafeAdd}</div>



<div class="container text-center">
        <div class="row">
        <div class="col-2">
          
          
          <button type="button" class="btn btn-primary position-relative">
          <Link href="/safeapp">  Safe App</Link> <span class="position-absolute top-0 start-100 translate-middle  border-light  p-2"><span class="visually-hidden">unread messages</span></span>
        </button>         
          
          
          </div>
        <div class="col-10"><h1><ul>


        <button type="button" class="btn btn-primary position-relative">
        <Link href="/Vote" onClick={store_values}>Voting Forum</Link><span class="position-absolute top-0 start-100 translate-middle  border-light  p-2"><span class="visually-hidden">unread messages</span></span>
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