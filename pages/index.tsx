import { motion } from 'framer-motion'
import { ethers } from 'ethers'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect,FC, useState } from 'react'
import { useAccount, useConnect, useDisconnect,useSwitchNetwork,useNetwork, chainId } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { contract, ABI, RPC } from '../contracts'
import Head from 'next/head';
import { opacityAnimation } from '../utils/animations'
const Home = () => {
    
      const router = useRouter()
    const initialFormState = {
    name:'',
    age: 0,
    gender: 'Male',
    phone:'',
    email:'',
    role: 1,
  }
    const { chain } = useNetwork()
    const { switchNetwork } = useSwitchNetwork()
    const [isUser,setUser] = useState(false)
    const { address, isConnected } = useAccount()
    const [Loading,setLoading] = useState(true)
    const [formData, setFormData] = useState(initialFormState)
    const [checkIfNewUser,setIfNewUser] = useState(false)
    const { connect } = useConnect({
    connector: new InjectedConnector(),
    })

    const checkUser = async ()=> {
        if(!address) {
            setLoading(false)
            setIfNewUser(false)
            setUser(false)
            return;
        }
        // let provider = new ethers.providers.Web3Provider(ethereum)
        const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai)
        
        const walletAddress = address // first account in MetaMask
        const signer = provider.getSigner(walletAddress)

        // console.log(signer)
        const carContract = new ethers.Contract(contract, ABI, signer)

        const isUser = await carContract.is_user(address)
        if(!isUser || isConnected) {
            setIfNewUser(true)
        }
        setUser(isUser)
        setLoading(false)
        // console.log(isUser)
    }
        useEffect(()=> {
        if (window.ethereum) {
              (window as any).ethereum.on('accountsChanged', function (accounts:any) {
        // Time to reload your interface with accounts[0]!
              checkUser()
              return
              })
        }
      })
      useEffect(()=> {
          // if(isConnected && isUser) router.push('./account')
          checkUser()
      })
    // let checkIfNewUser = isConnected && !isUser

  const handleClick = (_value:any)=> {
    if(!_value) return;
    router.push(`./${_value}`)
  }
  return (
      <div>
      <Head>
        <title id="title">HomePage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <></>
    <div className="container mx-auto text-center">
      {Loading && <p className='text-center'>Loading...</p>}
      {!Loading && 
      <>
      <h1 className="text-2xl font-bold ">Home Page</h1>
      <ul className='cursor-pointer'>
        {!isUser && <li onClick={()=> handleClick("login")}>
          Login
        </li>}
        {isUser &&
        <>
        <li onClick={()=> handleClick("dashboard")}>
          dashboard
        </li>
        <li onClick={()=> handleClick("account")}>
          account
        </li>
        </>
        }
      </ul>
      </>
    }
      {/* Your home page content here */}
    </div>
    </div>
  );
};

export default Home;
