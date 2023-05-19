import { useRouter } from 'next/router'
import { FC, ReactNode, useEffect } from 'react'
import { useState, createContext, useContext } from "react";
import { userLocation, userShortLocation } from './context';
// import Footer from './Footer'

import Header from './Header'
import axios from 'axios';
// import Detector from './NetworkDetector'

interface LayoutProps {
  children: ReactNode
}

const Buffer = () => {
  const router = useRouter()
  // if (router.asPath === '/') {
  //   return null
  // }
  return <div className="bg-transparent w-full h-[100px]"></div>
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const router = useRouter()

    const [userLat,setUserLat] = useState<any>() 
  const [userLong,setUserLong] = useState<any>()
  const [userLocationAddress,setUserLocationAddress] = useState<any>()
  const [userLocationShortName,setShortName] = useState<any>()

    useEffect(() => {
    navigator.geolocation.getCurrentPosition(position =>{            
        setUserLat(position.coords.latitude);
        setUserLong(position.coords.longitude)
      })
  },[userLat, userLong])

  const getAddress = (lat:any,long:any) => {
    if(!lat && !long) return
  return axios.get(`https://carpool.ak1223.repl.co/get-address/${lat}/${long}`)
    .then(res => res.data)
    .then(json => {
      if (!json?.address) {
        return null
      }
      let address = json?.address
      let shortName = json?.shortName
      setShortName(shortName)
      return setUserLocationAddress(address)
    })

  }

  getAddress(userLat, userLong)
  
  return (
    // ${router.asPath === '/'?"bg-backgroundImg":"bg-gradient-to-r"}
        <userLocation.Provider value={userLocationAddress} >
          <userShortLocation.Provider value={userLocationShortName} >

    <div className={`flex from-dark_mild to-dark_heavy bg-gradient-to-r bg-fixed bg-no-repeat justify-center`}> 
      <div className=" w-full max-w-[1920px] bg-fixed bg-no-repeat bg-cover opacity-100">
        {/* <video
        // poster="/images/hero/poster.png"
        preload="none"
        autoPlay
        muted
        loop
        className="w-full hidden lg:block opacity-20 absolute bg-fixed bg-no-repeat bg-cover z-[-10]"
      >
        <source src="/car_driving.mp4" type="video/mp4" />
      </video>
      <video
        // poster="/images/hero/poster.png"
        preload="none"
        autoPlay
        muted
        loop
        className="w-full block lg:hidden opacity-20 absolute bg-fixed bg-no-repeat bg-cover z-[-10]"
      >
        <source src="/car_driving2.mp4" type="video/mp4" />
      </video> */}
        {/* <Detector /> */}
        <Header />
        <Buffer />
        {/* <Loading /> */}
        {children}
        {/* <CurrentFooter /> */}
      </div>
    </div>
    </userShortLocation.Provider>
    </userLocation.Provider>
  )
}

export default Layout
