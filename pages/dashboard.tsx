import { motion } from 'framer-motion'
import { ethers } from 'ethers'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect,useSwitchNetwork,useNetwork, chainId } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { contract, ABI, RPC } from '../contracts'
import { add } from 'date-fns'
import { opacityAnimation } from '../utils/animations'
import UserActivity from '../components/UserActivity'
const DashboardPage: NextPage = () => {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [userInfo,setUserInfo] = useState<any>([])
  const [Loading,setLoading] = useState(true)
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const [userActivities,SetUserActivities] = useState<any>([])


  const checkUser = async ()=> {
    if(!isConnected) return router.push('./login');
    if(userInfo?.name) return;
    // let provider = new ethers.providers.Web3Provider(ethereum)
    const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai)

    const walletAddress = address // first account in MetaMask
    const signer = provider.getSigner(walletAddress)

    // console.log(signer)
    const carContract = new ethers.Contract(contract, ABI, signer)

    const isUser = await carContract.is_user(address)
    if(!isUser) return router.push('./login')
    // console.log(isUser)
    let getUser = await carContract.userInfo(address)
    let getUserActivities = await carContract.getUserActivities(address);
    SetUserActivities(getUserActivities)
    setUserInfo(getUser)
    setLoading(false)
    }
    
    console.log(userActivities)
    useEffect(()=> {
      if (window.ethereum) {
        (window as any).ethereum.on('accountsChanged', function (accounts:any) {
          setUserInfo([]);
          setLoading(true);
          checkUser();
          return;
        })
      }
    })

    useEffect(()=> {
        checkUser()
    })

  return (
    <main className="p-4 pt-6 lg:px-16 min-h-screen">
       {userInfo.name && !Loading && 
       <>
       
       <motion.div
              className="mt-8"
              variants={opacityAnimation}
              initial="initial"
              whileInView="final"
              viewport={{ once: true }}
              transition={{
                ease: 'easeInOut',
                duration: 1,
                delay: 0.5,
              }}
            >
       <div>
        <h1 className="text-2xl font-bold ">User Dashboard</h1>
        <br></br>
        {/* <ul>
            <li>User Id: {`${(userInfo?.user_id)?.toNumber()}`}</li>
            <li>Name: {userInfo?.name}</li>
            <li>Wallet Address: {address?address:''}</li>
            <li>Mobile Number: {userInfo?.phone}</li>
            <li>Email Id: {userInfo?.email}</li>
            <li>Age: {(userInfo?.age)?.toNumber()}</li>
            <li>Role: {(userInfo?.role)?.toNumber()==2?"Driver":(userInfo.role)?.toNumber()==1?"Traveller":''}</li>
        </ul> */}
        </div>
        <br></br>
        {/* <p>Account setting</p> */}
        <button className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg" onClick={()=> {router.push('./setting')}}>Account Setting</button>
        <button className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg" onClick={()=> {router.push('./rides')}}>Active Rides</button>
        <button className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg" onClick={()=> {router.push('./account')}}>My Account</button>
        <br></br>
        <br></br>
        <h1 className="text-2xl font-bold ">User Activities</h1>
        <br></br>
        <br></br>
       </motion.div>
       <UserActivity userActivities={userActivities}/>
       </>
       }
    </main>
  )
}

export default DashboardPage

