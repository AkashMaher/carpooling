import { motion } from 'framer-motion'
import { ethers } from 'ethers'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect,useSwitchNetwork,useNetwork, chainId } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { contract, ABI, RPC } from '../../contracts'
import { ActivityType, UserType } from '../../utils/interfaces'
import { add } from 'date-fns'
import { opacityAnimation } from '../../utils/animations'
import AllRides from '../../components/AllRides'
import Head from 'next/head';
import axios from 'axios'
import {
  useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer
} from "@react-google-maps/api";

const LIBRARIES:any = ["places"];
const googleMapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''

const DashboardPage: NextPage = () => {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [userInfo,setUserInfo] = useState<any>([])
  const [Loading,setLoading] = useState(true)
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const [userLocation, setUserLocation] = useState<any>('')
  const [allActiveRides,setActiveRides] = useState<ActivityType[]>([])

    const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapApiKey,
    libraries: LIBRARIES
  });
  
  const [userLat,setUserLat] = useState<any>() 
  const [userLong,setUserLong] = useState<any>() 

  useEffect(() => {
  navigator.geolocation.getCurrentPosition(position =>{            
        setUserLat(position.coords.latitude);
        setUserLong(position.coords.longitude)
        // getAddress(position.coords.latitude, position.coords.longitude)
        
      })
  },[userLat, userLong])

  async function calculateRoute(destination:any) {
    if (destination === "") {
      return false;
    }

    const directionsService = new google.maps.DirectionsService();
    const results:any = await directionsService.route({
      origin: new google.maps.LatLng(userLat, userLong), destination: destination, // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING
    });
    let distance = results.routes[0].legs[0].distance.text
    console.log(distance)
    return distance;
  }
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
    let isActiveRide = await carContract.isActiveRide(address)
    if((getUser?.role).toNumber() !== 2) return router.push(`../dashboard`)
    if(isActiveRide) return router.push('../rides/active')
    let activeRides = await carContract.getActiveRides();
    setActiveRides(activeRides)
    setUserInfo(getUser)
    setLoading(false)
    // let userLocation:any = await getAddress(userLat, userLong)
    // setUserLocation(userLocation)
    }

    // const filterRides = () => {
    //   const filtered = allActiveRides?.filter( async(a) => {
    //     let distanceFromUser = await calculateRoute(a?.from)
    //     console.log(distanceFromUser)
    //     let distance = Math.round(distanceFromUser.split(' ')[0])
    //     if(distance<=3) {
    //       return a
    //     }
    //     setActiveRides(filtered)
    //   })
    // }

    // useEffect(()=> {
    //   filterRides()
    // })

    
    // console.log(FilteredActivities)

    const onSwitchNetwork = async () => {
    await switchNetwork?.(chainId.polygonMumbai)
  }

    const handleRide = async (ride:ActivityType) => {
        const {id, status } = ride;
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
        let rideId = id.toNumber()
        let getUser = await carContract.userInfo(address)


        if((getUser?.role).toNumber() == 2 && status.toNumber() == 1) {
            const accept = await carContract.AcceptRide(rideId)
        .then((tx: any) => {
          console.log('processing')
          provider.waitForTransaction(tx.hash).then(()=> {
            console.log("Ride Accepted")
            router.push('../rides/active')
          })
        })
        .catch((e: { message: any }) => {
        console.log(e.message)
        return
        })
        } 
        
        
    }

    // console.log(allActiveRides)
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
    <div>
      <Head>
        <title id="title">Available Rides</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <>
    <main className="p-4 pt-6 lg:px-16 min-h-screen">
       {Loading && <p className='text-center'>Loading...</p>}
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
        <h1 className="text-2xl font-bold ">All Available Rides</h1>
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
        <button className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg" onClick={()=> {router.push('../account')}}>My Account</button>
        <button className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg" onClick={()=> {router.push('../dashboard')}}>Dashboard</button>
       </motion.div>
       <br></br>
       <AllRides userActivities={allActiveRides} handleRide={handleRide}/>
       </>
       }
    </main>
    </>
    </div>
  )
}

export default DashboardPage

