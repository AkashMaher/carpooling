import { motion } from 'framer-motion'
import { ethers } from 'ethers'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect,useSwitchNetwork,useNetwork, chainId } from 'wagmi'
import { contract, ABI, RPC } from '../../contracts'
import { add } from 'date-fns'
import { opacityAnimation } from '../../utils/animations'

const AccountPage: NextPage = () => {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [ride,setRide] = useState<any>([])
  const [Loading,setLoading] = useState(true)
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const checkUser = async ()=> {
    if(!isConnected) return router.push('../login');
    if(ride?.traveller == '0x0000000000000000000000000000000000000000') return router.push('../rides/request');
    // let provider = new ethers.providers.Web3Provider(ethereum)
    const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai)

    const walletAddress = address // first account in MetaMask
    const signer = provider.getSigner(walletAddress)

    // console.log(signer)
    const carContract = new ethers.Contract(contract, ABI, signer)

    const isUser = await carContract.is_user(address)
    if(!isUser) return router.push('../login')
    // console.log(isUser)
    let getRide = await carContract.activeRide(address)
    let isActiveRide = getRide?.traveller !== '0x0000000000000000000000000000000000000000';
    if(!isActiveRide) return router.push('../rides/request')
    let time= ''
    if ((getRide?.time).toNumber()) {
        let d = new Date((getRide?.time).toNumber()*1000)
        time = d.toLocaleString()
    }
    let Ride:any = {}
    Ride['costPerKM'] = (getRide?.costPerKM).toNumber()
    Ride['id'] = (getRide?.id).toNumber()
    Ride['distance'] = (getRide?.distance).toNumber()
    Ride['status'] = (getRide?.status).toNumber()
    Ride['time'] = time;
    Ride['traveller'] = getRide?.traveller
    Ride['driver'] = getRide?.driver
    Ride['from'] = getRide?.from
    Ride['to'] = getRide?.to
    setRide(Ride)
    setLoading(false)
    }
// console.log(ride)
    useEffect(()=> {
      if (window.ethereum) {
        (window as any).ethereum.on('accountsChanged', function (accounts:any) {
          setRide([]);
          setLoading(true);
          checkUser();
          return;
        })
      }
    })

    useEffect(()=> {
        checkUser()
    })

    const onSwitchNetwork = async () => {
    await switchNetwork?.(chainId.polygonMumbai)
  }
    let user = ride?.traveller == address?1:ride?.driver == address?2:0
    let isActiveRide = ride?.traveller !== '0x0000000000000000000000000000000000000000'
// console.log(ride)

    const handleRide = async () => {
        const ethereum = (window as any).ethereum
        const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
        })
        if(chain?.id !== chainId?.polygonMumbai) {
            await onSwitchNetwork()
        }
        let provider = new ethers.providers.Web3Provider(ethereum)
        // const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai)

        const walletAddress = address // first account in MetaMask
        const signer = provider.getSigner(walletAddress)

        // console.log(signer)
        const carContract = new ethers.Contract(contract, ABI, signer)

        const isUser = await carContract.is_user(address)
        if(!isUser) return console.log("user account not exist")
        console.log(isUser)
        let rideId = ride?.id
        let getUser = await carContract.userInfo(address)


        if((getUser?.role).toNumber() == 1 && ride?.status ==3) {
            const approve = await carContract.approveRide(rideId)
        .then((tx: any) => {
          console.log('processing')
          provider.waitForTransaction(tx.hash).then(()=> {
            console.log("Ride Approved")
            router.push('../dashboard')
          })
        })
        .catch((e: { message: any }) => {
        console.log(e.message)
        return
        })
        // } else if((getUser?.role).toNumber() == 2) {
        //     console.log('cancel by driver')
        //     const cancel = await carContract.cancelRideByDriver(rideId)
        // .then((tx: any) => {
        //   console.log('processing')
        //   provider.waitForTransaction(tx.hash).then(()=> {
        //     console.log("Ride Cancelled By Driver")
        //     // router.push('../')
        //   })
        // })
        // .catch((e: { message: any }) => {
        // console.log(e.message)
        // return
        // })
        } else if((getUser?.role).toNumber() == 1 && ride?.status ==1) {
            const cancel = await carContract.cancelRide(rideId)
        .then((tx: any) => {
          console.log('processing')
          provider.waitForTransaction(tx.hash).then(()=> {
            console.log("Ride Cancelled By Driver")
            // router.push('../')
          })
        })
        .catch((e: { message: any }) => {
        console.log(e.message)
        return
        })
        } 
        
        
    }


  return (
    <main className="p-4 pt-6 lg:px-16 min-h-screen">
        {Loading && <p className='text-center'>Loading...</p>}
        {!Loading && !isActiveRide && 
        <>
        <h1>No Any Active Rides</h1>
        </>}
       {isActiveRide && !Loading && 
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
                delay: 0.4,
              }}
            >
       <div>
        <h1 className="text-2xl font-bold ">Account Info</h1>
        <br></br>
        <ul>
            <li>Ride Id: {`${ride?.id}`}</li>
            <li>Driver Address: {ride?.driver}</li>
            <li>Traveller Address: {ride?.traveller}</li>
            <li>From : {ride?.from}</li>
            <li>To : {ride?.to}</li>
            <li>Distance: {ride?.distance}</li>
            <li>Cost Per KM: {ride?.costPerKM}</li>
            <li>Status: {ride?.status==1?"Requested":ride?.status==2?"Cancelled":ride?.status==3?"Accepted":ride?.status==4?"Completed":''}</li>
            <li>Time: {ride?.time}</li>
        </ul>
        </div>
        <br></br>
        
        {user==1 &&
            <button className={`outline-none mr-4 mt-4 w-30 h-full ${user==1 && ride?.status ==3?"bg-[#48bc12]": (ride?.status ==1 && user==1)?"bg-[#c91e1e]":''} py-[1%] px-[9.5%] text-white rounded-lg`} onClick={()=> handleRide()}>{user==1 && ride?.status ==3?'Approve Ride':(ride?.status ==1 && user==1)?'Cancel Ride':''}</button>
        }
       </motion.div>
       </>
       }
    </main>
  )
}

export default AccountPage
