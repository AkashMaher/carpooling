import { motion } from "framer-motion";
import { ethers } from "ethers";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchNetwork,
  useNetwork,
  chainId,
} from "wagmi";
import { contract, ABI, RPC } from "../../contracts";
import { add } from "date-fns";
import { opacityAnimation } from "../../utils/animations";
import Head from "next/head";
import {
  Box,
} from "@chakra-ui/react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { mapStyle } from "../../components/mapStyle";
import useWindowDimensions from "../../utils/hooks/useWindowDimensions";
import userContext from "../../components/context/user";
const LIBRARIES: any = ["places"];
const googleMapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";
const AccountPage: NextPage = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapApiKey,
    libraries: LIBRARIES,
  });

  const { address, isConnected } = useAccount();
  const router = useRouter();
  // const [ride, setRide] = useState<any>([]);
  // const [Loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const [style, setStyle] = useState({ width: "100%", height: "100%" });
  const [userLat, setUserLat] = useState<any>();
  const [userLong, setUserLong] = useState<any>();
  const [map, setMap] = useState<any>();
  const [directionsResponse, setDirectionsResponse] = useState<any>();
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [curr, setCurr] = useState<any>("");
  // const [userContactNumber, setUserContactNumber] = useState("");
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [isChainCorrect, setIsChainCorrect] = useState(true);
  const chainID = 80001;

  const {
    userInfo,userActivities, userBalance, userRole, isActiveRide, setUserBalance, ride,userContactNumber, Loading
  } = useContext(userContext)
  useEffect(() => {
    if (!chainID) return;
    if (chain?.id === chainID) {
      setIsChainCorrect(true);
      return;
    } else {
      setIsChainCorrect(false);
      return;
    }
  }, [chain, chainID]);

  const onSwitchNetwork = async () => {
    await switchNetwork?.(chainID);
  };
  useEffect(() => {
    if (width < 640) {
      setStyle({ width: "90%", height: "40%" });
    } else {
      setStyle({ width: "50%", height: "60%" });
    }
  }, [width]);

  const center = { lat: userLat, lng: userLong };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLat(position.coords.latitude);
      setUserLong(position.coords.longitude);
    });
  }, [userLat, userLong]);

  async function calculateRoute(origin: any, destination: any) {
    if (origin === "" || destination === "") {
      return false;
    }

    const directionsService = new google.maps.DirectionsService();
    const results: any = await directionsService.route({
      origin: origin,
      destination: destination, // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  // const checkUser = async () => {
  //   if (!isConnected) return router.push("../login");
  //   if (ride?.traveller == "0x0000000000000000000000000000000000000000")
  //     return router.push("../rides/request");
  //   // let provider = new ethers.providers.Web3Provider(ethereum)
  //   const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai);

  //   const walletAddress = address; // first account in MetaMask
  //   const signer = provider.getSigner(walletAddress);

  //   // console.log(signer)
  //   const carContract = new ethers.Contract(contract, ABI, signer);

  //   const isUser = await carContract.is_user(address);
  //   if (!isUser) return router.push("../login");
  //   // console.log(isUser)
  //   let getRide = await carContract.activeRide(address);
  //   let isActiveRide =
  //     getRide?.traveller !== "0x0000000000000000000000000000000000000000";
  //   if (!isActiveRide) return router.push("../dashboard");
  //   let time = "";
  //   if ((getRide?.time).toNumber()) {
  //     let d = new Date((getRide?.time).toNumber() * 1000);
  //     time = d.toLocaleString();
  //   }
  //   let Ride: any = {};
  //   Ride["costPerKM"] = (getRide?.costPerKM).toNumber();
  //   Ride["id"] = (getRide?.id).toNumber();
  //   Ride["distance"] = (getRide?.distance).toNumber();
  //   Ride["status"] = (getRide?.status).toNumber();
  //   Ride["time"] = time;
  //   Ride["traveller"] = getRide?.traveller;
  //   Ride["driver"] = getRide?.driver;
  //   Ride["from"] = getRide?.from;
  //   Ride["to"] = getRide?.to;
  //   setRide(Ride);
  //   setLoading(false);
  //   let userAddress =
  //     address == getRide?.traveller
  //       ? getRide?.driver
  //       : address == getRide?.driver
  //       ? getRide?.traveller
  //       : "";
  //   await getUserInfo(userAddress);
  //   await calculateRoute(getRide?.from, getRide?.to);
  // };
  // // console.log(ride)
  // useEffect(() => {
  //   if (window.ethereum) {
  //     (window as any).ethereum.on("accountsChanged", function (accounts: any) {
  //       setRide([]);
  //       setLoading(true);
  //       checkUser();
  //       return;
  //     });
  //   }
  // });

  // useEffect(() => {
  //   if (user) return;
  //   checkUser();
  //   return;
  // });

  // const getUserInfo = async (userAddress: any) => {
  //   if (!userAddress) return;
  //   const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai);

  //   const walletAddress = address; // first account in MetaMask
  //   const signer = provider.getSigner(walletAddress);

  //   // console.log(signer)
  //   const carContract = new ethers.Contract(contract, ABI, signer);

  //   console.log(userAddress);
  //   const isUser = await carContract.is_user(userAddress);

  //   if (!isUser) return "";

  //   let userInfo = await carContract.userInfo(userAddress);
  //   setUserContactNumber(userInfo?.phone);
  // };

  // useEffect(()=> {
  //   getUserInfo()
  // })

  //   const onSwitchNetwork = async () => {
  //   await switchNetwork?.(chainId.polygonMumbai)
  // }
  let user = ride?.traveller == address ? 1 : ride?.driver == address ? 2 : 0;
  // let isActiveRide = ride?.traveller !== "0x0000000000000000000000000000000000000000";
  // console.log(ride)

  const handleRide = async () => {
    const ethereum = (window as any).ethereum;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    if (chain?.id !== chainId?.polygonMumbai) {
      await onSwitchNetwork();
    }
    let provider = new ethers.providers.Web3Provider(ethereum);
    // const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai)

    const walletAddress = address; // first account in MetaMask
    const signer = provider.getSigner(walletAddress);

    // console.log(signer)
    const carContract = new ethers.Contract(contract, ABI, signer);

    const isUser = await carContract.is_user(address);
    if (!isUser) return console.log("user account not exist");
    console.log(isUser);
    let rideId = ride?.id;
    let getUser = await carContract.userInfo(address);

    if ((getUser?.role).toNumber() == 1 && ride?.status == 3) {
      const approve = await carContract
        .approveRide(rideId)
        .then((tx: any) => {
          console.log("processing");
          provider.waitForTransaction(tx.hash).then(() => {
            console.log("Ride Approved");
            router.push("../dashboard");
          });
        })
        .catch((e: { message: any }) => {
          console.log(e.message);
          return;
        });
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
    } else if ((getUser?.role).toNumber() == 1 && ride?.status == 1) {
      const cancel = await carContract
        .cancelRide(rideId)
        .then((tx: any) => {
          console.log("processing");
          provider.waitForTransaction(tx.hash).then(() => {
            console.log("Ride Cancelled");
            router.push("../dashboard");
            // router.push('../')
          });
        })
        .catch((e: { message: any }) => {
          console.log(e.message);
          return;
        });
    }
  };

  if (!isLoaded) {
    return <div>LOADING</div>;
  }

  return (
    <div>
      <Head>
        <title id="title">Your Ride</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <main className="p-4 pt-6 lg:px-16 min-h-screen">
          {Loading && <p className="text-center">Loading...</p>}
          {!Loading && !isActiveRide && (
            <>
              <h1>No Any Active Rides</h1>
            </>
          )}
          {isActiveRide && !Loading && (
            <>
              <div className="flex flex-col lg:flex-row justify-between gap-6 mt-8">
                <div>
                  <motion.div
                    className="mt-8"
                    variants={opacityAnimation}
                    initial="initial"
                    whileInView="final"
                    viewport={{ once: true }}
                    transition={{
                      ease: "easeInOut",
                      duration: 1,
                      delay: 0.4,
                    }}
                  >
                    <div>
                      <h1 className="text-2xl font-bold ">Your Active Ride</h1>
                      <br></br>
                      <ul>
                        <li>
                          <span className="text-blue-500">Ride Id:</span>{" "}
                          {`${ride?.id}`}
                        </li>
                        <li>
                          <span className="text-blue-500">Driver Address:</span>{" "}
                          {ride?.driver}
                        </li>
                        <li>
                          <span className="text-blue-500">
                            Passenger Address:
                          </span>{" "}
                          {ride?.traveller}
                        </li>
                        <li>
                          <span className="text-blue-500">From :</span>{" "}
                          {ride?.from}
                        </li>
                        <li>
                          <span className="text-blue-500">To :</span> {ride?.to}
                        </li>
                        <li>
                          <span className="text-blue-500">Distance:</span>{" "}
                          {ride?.distance} <span>KM</span>
                        </li>
                        <li>
                          <span className="text-blue-500">Cost :</span>{" "}
                          {ride?.costPerKM * ride?.distance} INR
                        </li>
                        <li>
                          <span className="text-blue-500">Status:</span>{" "}
                          {ride?.status == 1
                            ? "Requested"
                            : ride?.status == 2
                            ? "Cancelled"
                            : ride?.status == 3
                            ? "Accepted"
                            : ride?.status == 4
                            ? "Completed"
                            : ""}
                        </li>
                        <li>
                          <span className="text-blue-500">Time:</span>{" "}
                          {ride?.time}
                        </li>
                      </ul>
                    </div>
                    <br></br>

                    {user == 1 && (
                      <button
                        className={`outline-none mr-4 mt-4 w-30 h-full ${
                          user == 1 && ride?.status == 3
                            ? "bg-[#48bc12]"
                            : ride?.status == 1 && user == 1
                            ? "bg-[#c91e1e]"
                            : ""
                        } py-[1%] px-[9.5%] text-white rounded-lg`}
                        onClick={() => {
                          isChainCorrect ? handleRide() : onSwitchNetwork();
                        }}
                      >
                        {isChainCorrect
                          ? user == 1 && ride?.status == 3
                            ? "Approve Ride"
                            : ride?.status == 1 && user == 1
                            ? "Cancel Ride"
                            : ""
                          : "Switch Network"}
                      </button>
                    )}
                    {userContactNumber && (
                      <div className="pt-5">
                        <ul>
                          <li>
                            {user == 1
                              ? "Driver Contact Info"
                              : "Passenger Contact Info"}
                          </li>
                          <li>
                            Mobile Number: <span>{userContactNumber}</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </motion.div>
                </div>
                <div className="pt-20">
                  <>
                    <div
                      className="relative flex flex-col align-middle h-[100vh] w-[100vw]"
                      // position="relative"
                      // flexDirection="column"
                      // alignItems="center"
                      // h="100vh"
                      // w="100vw"
                    >
                      <Box className="adsolute left-0 top-0 h-[100%] w-[100%]">
                        <GoogleMap
                          // center={center}
                          zoom={15}
                          mapContainerStyle={style}
                          options={{
                            zoomControl: false,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                            styles: mapStyle,
                          }}
                          onLoad={(map) => setMap(map)}
                        >
                          <Marker position={center} />
                          {directionsResponse && (
                            <div>
                              <Marker
                                clickable={false}
                                position={
                                  directionsResponse.routes[0].legs[0]
                                    .start_location
                                }
                                options={{
                                  icon: {
                                    url: "https://www.picng.com/upload/vinyl/png_vinyl_35563.png",
                                    scaledSize: new google.maps.Size(18, 18),
                                  },
                                }}
                              />
                              <Marker
                                clickable={false}
                                position={
                                  directionsResponse.routes[0].legs[0]
                                    .end_location
                                }
                                options={{
                                  icon: {
                                    url: "https://images.unsplash.com/photo-1580407836821-60af99465138?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
                                    scaledSize: new google.maps.Size(18, 18),
                                  },
                                }}
                              />
                              <DirectionsRenderer
                                directions={directionsResponse}
                                options={{
                                  polylineOptions: {
                                    clickable: false,
                                    strokeColor: "black",
                                    strokeWeight: 3,
                                    strokeOpacity: 1,
                                    geodesic: false,
                                  },
                                  suppressMarkers: true,
                                }}
                              />
                            </div>
                          )}
                          {curr && <Marker position={curr}></Marker>}
                        </GoogleMap>
                      </Box>
                    </div>
                  </>
                </div>
              </div>
            </>
          )}
        </main>
      </>
    </div>
  );
};

export default AccountPage;
