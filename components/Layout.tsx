import { useRouter } from "next/router";
import { FC, ReactNode, useEffect } from "react";
import { useState, createContext, useContext } from "react";
import { userLocation, userShortLocation, userInfo } from "./context";
import userContext, { IUserContextProps } from "./context/user";
// import Footer from './Footer'
import { ethers } from "ethers";
import { contract, ABI, RPC } from "../contracts";
import Header from "./Header";
import axios from "axios";
import { useAccount } from "wagmi";
import { ActivityType } from "../utils/interfaces";
// import {handleDriverUpdate, handleOnlineDrivers} from "./api"
// import Detector from './NetworkDetector'
import { updateDriver, getAllDrivers } from "../react-query/queries";
import { queryClient } from "../react-query/queryClient";
import { useMutation, useQuery } from "react-query";
import { QUERIES } from "../react-query/constants";
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
  const [isConnect, setIsConnect] = useState<boolean>();
  const [userLocationAddress, setUserLocationAddress] = useState<any>();
  const [userLocationShortName, setShortName] = useState<any>();
  const [userInfo, setUserInfo] = useState<any>();
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
  const [onlineDrivers, setDrivers] = useState<any>([]);
  const [isLocationActive, setLocationActive] = useState(false);
  useEffect(() => {
    const interval = setInterval(async () => {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLat(position.coords.latitude);
        setUserLong(position.coords.longitude);
        setLocationActive(true);
      });
      console.log("update location");
    }, 150000);

    return () => {
      clearInterval(interval);
    };
  }, [userLat, userLong]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLat(position.coords.latitude);
      setUserLong(position.coords.longitude);
      setLocationActive(true);
    });
  }, [userLat, userLong]);

  const userContextValue: IUserContextProps = {
    userInfo,
    userActivities,
    userBalance,
    userRole,
    isActiveRide,
    setUserBalance,
    ride,
    userContactNumber,
    allActiveRides,
    costPerKM,
    isConnect,
    setIsConnect,
    Loading,
    checkIfNewUser,
    isUser,
    setUser,
    setRide,
    setIsActiveRide,
    setUserRole,
    setUserInfo,
    setLoading,
    SetUserActivities,
    onlineDrivers,
    setDrivers,
    isLocationActive,
  };

  const { address, isConnected } = useAccount();

  const checkUser = async () => {
    try {
      if (!isConnected) {
        if (
          router.asPath == "/rides/request" ||
          router.asPath == "/rides/active"
        )
          return router.push("../login");
        if (router.asPath !== "/") return router.push("./login");
      }
      // if(router.asPath !== '/login') {
      //   return;
      // };
      if (userInfo?.name && isConnect) return;
      if (!address) {
        setLoading(false);
        setIfNewUser(false);
        return;
      }
      setIsConnect(true);
      setLoading(true);
      // let provider = new ethers.providers.Web3Provider(ethereum)
      const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai);

      const walletAddress = address; // first account in MetaMask
      const signer = provider.getSigner(walletAddress);

      // console.log(signer)
      const carContract = new ethers.Contract(contract, ABI, signer);

      // const is_user = await carContract.is_user(address);
      
      // 
      // console.log(isUser)

      // let getUser = await carContract.userInfo(address);
      // let isActiveRide = await carContract.isActiveRide(address);
      // let balance = await carContract.balance(address);
      // let getRide = await carContract.activeRide(address);
      // let getUserActivities = await carContract.getUserActivities(address);
      // let activeRides = await carContract.getActiveRides();
      // const getCost = await carContract.costPerKM();
      // 
      // if ((getRide?.time).toNumber()) {
      //   let d = new Date((getRide?.time).toNumber() * 1000);
      //   time = d.toLocaleString();
      // }

      const [
        is_user,
        getUser,
        isActiveRide,
        balance,
        getRide,
        getUserActivities,
        activeRides,
        getCost,
      ] = await Promise.all([
        carContract.is_user(address),
        carContract.userInfo(address),
        carContract.isActiveRide(address),
        carContract.balance(address),
        carContract.activeRide(address),
        carContract.getUserActivities(address),
        carContract.getActiveRides(),
        carContract.costPerKM(),
      ]);

      if (is_user || isConnected) {
        setIfNewUser(true);
      }
      if (!is_user){ 
        router.push("./login");
        setUser(is_user);
        return
      }
      let time = "";
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

      setCostPerKM(parseInt(getCost));

      let otherUserAddress =
        address == getRide?.traveller
          ? getRide?.driver
          : address == getRide?.driver
          ? getRide?.traveller
          : "";

      if (otherUserAddress) {
        const isOtherUser = await carContract.is_user(otherUserAddress);

        if (isOtherUser) {
          let otherUser = await carContract.userInfo(otherUserAddress);
          setUserContactNumber(otherUser?.phone);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    mutate: UpdateDriver,
    data,
    isLoading,
    isSuccess,
  } = useMutation(updateDriver, {
    onSuccess: () => {},
  });
  const distance = 5000;
  const { data: driversData } = useQuery(
    [QUERIES.getAllDrivers, userLong, userLat],
    () => getAllDrivers(userLong, userLat, distance)
  );

  useEffect(() => {
    // setDrivers(driversData?.data?.data ? driversData?.data?.data : []);
    let arr = []
    for (let i = 0; i < driversData?.data?.data?.length; i++) {
      let lat = driversData?.data?.data?.[i]?.location[1]
      let lng = driversData?.data?.data?.[i]?.location[0]
      arr.push({lat, lng})
      
    }
    console.log("arr");
    console.log(arr);
    setDrivers(arr);
    console.log(driversData?.data?.data?.[0]?.location);
  }, [driversData?.data, userLong, userLat]);

  // async function checkAndUpdate() {
  //   if(userInfo?.role ==2 && address && userLong && userLat) {
  //     const data = {driverId:address, online:true, location:[userLong, userLat]}
  //     await handleDriverUpdate(data)
  //   }
  // }

  useEffect(() => {
    if (
      userInfo?.role == 2 &&
      address &&
      userLong &&
      userLat &&
      !isActiveRide
    ) {
      const data = {
        driverId: address,
        online: true,
        location: [userLong, userLat],
      };
      UpdateDriver(data);
    } 
  }, [userLong, userLat, userInfo?.role, address, UpdateDriver, isActiveRide]);

  useEffect(() => {
    if (window.ethereum) {
      (window as any).ethereum.on("accountsChanged", async function (accounts: any) {
        setLoading(true)
        setIsConnect(false);
        setUserInfo([]);
        SetUserActivities([]);
        setUserRole(0);
        setUserBalance(0);
        setIsActiveRide(false);
        setActiveRides([]);
        setRide([]);
        // await checkUser();
        // router.push("/login")
        return setLoading(false);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  const getAddress = async (lat: any, long: any) => {
    if ((!lat && !long) || userLocationShortName) return;
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
