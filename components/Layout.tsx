import { useRouter } from "next/router";
import { FC, ReactNode, useEffect } from "react";
import { useState, createContext, useContext } from "react";
import { userLocation, userShortLocation,userInfo } from "./context";
import userContext,{IUserContextProps} from "./context/user";
// import Footer from './Footer'
import { ethers } from "ethers";
import { contract, ABI, RPC } from "../contracts";

import Header from "./Header";
import axios from "axios";
import { useAccount } from "wagmi";
import { ActivityType } from "../utils/interfaces";
// import Detector from './NetworkDetector'

interface LayoutProps {
  children: ReactNode;
}

const Buffer = () => {
  const router = useRouter();
  // if (router.asPath === '/') {
  //   return null
  // }
  return <div className="bg-transparent w-full h-[100px]"></div>;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  
  const [userLat, setUserLat] = useState<any>();
  const [userLong, setUserLong] = useState<any>();
  const [isConnect,setIsConnect] = useState<boolean>()
  const [userLocationAddress, setUserLocationAddress] = useState<any>();
  const [userLocationShortName, setShortName] = useState<any>();
  const [userInfo,setUserInfo] = useState<any>()
  const [isActiveRide, setIsActiveRide] = useState(false);
  const [userRole, setUserRole] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [userActivities, SetUserActivities] = useState<any>([]);
  const [userContactNumber, setUserContactNumber] = useState("");
  const [allActiveRides, setActiveRides] = useState<ActivityType[]>([]);
  const [ride, setRide] = useState<any>([]);
  const [costPerKM, setCostPerKM] = useState(10);
  const [Loading, setLoading] = useState(true);
  const [checkIfNewUser, setIfNewUser] = useState(false);
  const [isUser, setUser] = useState(false);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLat(position.coords.latitude);
      setUserLong(position.coords.longitude);
      console.log(position.coords);
    });
  }, [userLat, userLong]);

  const userContextValue: IUserContextProps = {
    userInfo,userActivities, userBalance, userRole, isActiveRide, setUserBalance, ride,userContactNumber, allActiveRides, costPerKM, isConnect, setIsConnect, Loading, checkIfNewUser, isUser
  }

  const { address, isConnected } = useAccount();

  const checkUser = async () => {
    if (!isConnected) return router.push("./login");
    if (userInfo?.name && isConnect) return;
    if (!address) {
      setLoading(false);
      setIfNewUser(false);
      return;
    }
    setIsConnect(true)
    setLoading(true)
    // let provider = new ethers.providers.Web3Provider(ethereum)
    const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai);

    const walletAddress = address; // first account in MetaMask
    const signer = provider.getSigner(walletAddress);

    // console.log(signer)
    const carContract = new ethers.Contract(contract, ABI, signer);

    const is_user = await carContract.is_user(address);
    if (is_user || isConnected) {
      setIfNewUser(true);
    }
    // if (!isUser) return router.push("./login");
    // console.log(isUser)

    let getUser = await carContract.userInfo(address);
    let isActiveRide = await carContract.isActiveRide(address);
    let balance = await carContract.balance(address);
    let getRide = await carContract.activeRide(address);
    let getUserActivities = await carContract.getUserActivities(address);
    let activeRides = await carContract.getActiveRides();
    const getCost = await carContract.costPerKM();
    let time = "";
    if ((getRide?.time).toNumber()) {
      let d = new Date((getRide?.time).toNumber() * 1000);
      time = d.toLocaleString();
    }
    let Ride: any = {};
    Ride["costPerKM"] = (getRide?.costPerKM).toNumber();
    Ride["id"] = (getRide?.id).toNumber();
    Ride["distance"] = (getRide?.distance).toNumber();
    Ride["status"] = (getRide?.status).toNumber();
    Ride["time"] = time;
    Ride["traveller"] = getRide?.traveller;
    Ride["driver"] = getRide?.driver;
    Ride["from"] = getRide?.from;
    Ride["to"] = getRide?.to;

    setUserRole((getUser?.role).toNumber());
    SetUserActivities(getUserActivities);
    setUserBalance(balance.toNumber());
    setIsActiveRide(isActiveRide);
    setUserInfo(getUser);
    setActiveRides(activeRides);
    setRide(Ride);
    setUser(is_user)
    setCostPerKM(parseInt(getCost));

    let otherUserAddress =
      address == getRide?.traveller
        ? getRide?.driver
        : address == getRide?.driver
        ? getRide?.traveller
        : "";

    if(otherUserAddress) {
      const isOtherUser = await carContract.is_user(otherUserAddress);

    if (isOtherUser) {
      let otherUser = await carContract.userInfo(otherUserAddress);
    setUserContactNumber(otherUser?.phone);
    }
    }
    setLoading(false)
  };

  useEffect(() => {
    if (window.ethereum) {
      (window as any).ethereum.on("accountsChanged", function (accounts: any) {
        setUserInfo([]);
        checkUser();
        return;
      });
    }
  });

  // useEffect(()=> {
  //   setUserInfo([]);
  //   checkUser();
  //   console.log('call user')
  //   return;
  // },[!isConnect])


  useEffect(() => {
    checkUser();
  });

  const getAddress = async (lat: any, long: any) => {
    if (!lat && !long || userLocationShortName) return;
    await axios
      .get(`https://carpool.ak1223.repl.co/get-address/${lat}/${long}`)
      .then((res) => res.data)
      .then((json) => {
        if (!json?.address) {
          return null;
        }
        let address = json?.address;
        let shortName = json?.shortName;
        setShortName(shortName);
        return setUserLocationAddress(address);
      });

    return;
  };

  // getAddress(userLat, userLong);

  return (
    // ${router.asPath === '/'?"bg-backgroundImg":"bg-gradient-to-r"}
    <userLocation.Provider value={userLocationAddress}>
      <userShortLocation.Provider value={userLocationShortName}>
        <userContext.Provider value={userContextValue}>
        <div
          className={`flex from-dark_mild to-dark_heavy bg-gradient-to-r bg-fixed bg-no-repeat justify-center`}
        >
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
        </userContext.Provider>
      </userShortLocation.Provider>
    </userLocation.Provider>
  );
};

export default Layout;
