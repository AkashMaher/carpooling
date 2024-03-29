import { motion } from "framer-motion";
import { ethers } from "ethers";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, FC, useState, useRef, useContext } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchNetwork,
  useNetwork,
  chainId,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { contract, ABI, RPC, ERC20ABI, ERC20Contract } from "../../contracts";
import Head from "next/head";
import { opacityAnimation } from "../../utils/animations";
import { mapStyle } from "../../components/mapStyle";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios, { all } from "axios";
import useWindowDimensions from "../../utils/hooks/useWindowDimensions";
import { getAddress } from "ethers/lib/utils";
import { userLocation } from "../../components/context";

import userContext from "../../components/context/user";
import { toast } from "react-toastify";
import React from "react";
import useIsMounted from "../../utils/hooks/useIsMounted";
// const chainId = '80001'
type selectDataType = {
  name: string;
  value: string;
};

const LIBRARIES: any = ["places"];
const googleMapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";

const RequestRide: FC<{
  requestRide: (distance: any, from: any, to: any) => void;
  costPerKM: number;
  setFormData: (_value: any) => void;
}> = ({ requestRide, costPerKM, setFormData }) => {
  const { address } = useAccount();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapApiKey,
    libraries: LIBRARIES,
  });

  const [map, setMap] = useState<any>();
  const [directionsResponse, setDirectionsResponse] = useState<any>();
  const [distance, setDistance] = useState<any>("");
  const [duration, setDuration] = useState("");
  const [curr, setCurr] = useState<any>("");
  const [screenWidth, setScreenWidth] = useState<any>();
  const [style, setStyle] = useState({ width: "100%", height: "100%" });
  const { width } = useWindowDimensions();
  const [userLat, setUserLat] = useState<any>();
  const [userLong, setUserLong] = useState<any>();
  const [cost, setCost] = useState<any>("");
  const [isMyLocation, setMyLocation] = useState(false);
  const [center, setCenter] = useState<any>({ lat: 18.5204, lng: 73.8567 });
  const [Fetched, setFetched] = useState(false);
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [isChainCorrect, setIsChainCorrect] = useState(true);
  const [driversCoordinates, setDriversCoordinates] = useState<any>([]);
  const chainID = 80001;

  const { onlineDrivers } = useContext(userContext);
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

  const fitBounds = () => {
    if (!map) return;
    if (!driversCoordinates) return;
    const bounds = new window.google.maps.LatLngBounds();
    driversCoordinates.forEach((coordinates: any) => {
      bounds.extend(new window.google.maps.LatLng(coordinates));
    });
    // bounds.extend(centerCoordinates.current);
    map?.fitBounds(bounds);
  };

  useEffect(() => {
    setDriversCoordinates(onlineDrivers);
    fitBounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineDrivers, driversCoordinates]);

  const originRef: any = useRef();
  const destinationRef: any = useRef();

  useEffect(() => {
    if (width < 640) {
      setStyle({ width: "90%", height: "40%" });
    } else {
      setStyle({ width: "50%", height: "60%" });
    }
  }, [width]);

  useEffect(() => {
    let prefix = distance.split(" ")[1];
    let cost =
      prefix == "km"
        ? Math.round(distance.split(" ")[0]) * costPerKM
        : prefix == "m"
        ? 10
        : 0;
    setCost(
      parseFloat(distance) < 1 ? "10 INR" : !isNaN(cost) ? `${cost} INR` : ""
    );
  }, [distance, costPerKM]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLat(position.coords.latitude);
      setUserLong(position.coords.longitude);
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, [userLat, userLong]);

  if (!isLoaded) {
    return (
      <div>
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  async function calculateRoute() {
    if (
      originRef?.current?.value === "" ||
      destinationRef?.current?.value === ""
    ) {
      return false;
    }

    // await handleUserInput("from",from)
    // await handleUserInput("to",to)

    const directionsService = new google.maps.DirectionsService();
    const results: any = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value, // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
    let distance = results.routes[0].legs[0].distance.text.split(" ")[0];
    let from = originRef?.current?.value;
    let to = destinationRef?.current?.value;
    setFetched(true);
  }



  async function selectMyLocation() {
    // setMyLocation(true)
    let locationAddress: any = await reverseGeocode(userLat, userLong);
    originRef.current.value = locationAddress;
  }

  async function reverseGeocode(lat: any, lng: any) {
    const geocoder = new google.maps.Geocoder();
    try {
      const result = await geocoder.geocode({
        location: {
          lat: lat,
          lng: lng,
        },
      });
      const { results } = result;
      let x = result.results[0].formatted_address;
      return x;
    } catch (e) {
      console.log("Geocode was not successful for the following reason: " + e);
    }
  }



  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setCurr("");
    setCost("");
    setMyLocation(false);
    setFetched(false);
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  const checkAndRequest = async () => {
    let prefix = distance.split(" ")[1];
    let Distance =
      prefix == "km" ? distance.split(" ")[0] : prefix == "m" ? 1 : 0;
    let from = originRef?.current?.value;
    let to = destinationRef?.current?.value;
    await requestRide(Distance, from, to);
    // console.log(distance, from, to)

    // let check = await calculateRoute()
    // setTimeout(async ()=> {
    //   //

    // },1000)
  };

  async function updateDetails() {
    setFetched(false);
    setDistance("");
    setDuration("");
    setCurr("");
    setCost("");
  }

  // const hahah = driversCoordinates?.map(
  //   (location: any, index: React.Key | null | undefined) => {
  //     {
  //       console.log(location.location);
  //       return location.location;
  //     }
  //   }
  // );
  // console.log("mapped data", hahah);

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between gap-6 mt-8">
        <motion.div
          className="mt-8"
          variants={opacityAnimation}
          initial="initial"
          whileInView="final"
          viewport={{ once: true }}
          transition={{
            ease: "easeInOut",
            duration: 1,
            delay: 0.5,
          }}
        >
          <h1 className="text-lg font-bold">Request a Ride</h1>
          <p>
            Wallet Address :{" "}
            <span className="text-[0.6rem] lg:text-lg">{address}</span>
          </p>
          <br></br>

          {/* <div className="h-[35px] relative rounded-lg">
            <input
                onChange={(e) => handleUserInput("distance",e.target.value)}
                type="any"
                id="distance"
                value={''}
                defaultValue='1'
                className="outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg"
            />
        </div> */}
          <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
            <label htmlFor="phone">
              Origin{" "}
              <span
                className="text-blue-500 text-sm cursor-pointer"
                onClick={() => selectMyLocation()}
              >
                📍Current location
              </span>
            </label>
          </div>
          <div className="h-[35px] relative rounded-lg">
            <Autocomplete className="h-[35px] relative rounded-lg">
              <input
                type="text"
                id="from"
                placeholder="Enter Origin"
                onChange={updateDetails}
                disabled={isMyLocation}
                ref={originRef}
                className={`outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg`}
              />
            </Autocomplete>
          </div>
          <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
            <label htmlFor="to">Destination</label>
          </div>
          <div className="h-[35px] relative rounded-lg">
            <Autocomplete className="h-[35px] relative rounded-lg">
              <input
                type="any"
                id="to"
                onChange={updateDetails}
                placeholder="Enter Destination"
                ref={destinationRef}
                className="outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg"
              />
            </Autocomplete>
          </div>
          <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
            <label htmlFor="distance">
              <p>
                Distance : <span>{distance ? distance : ""}</span>
              </p>
              <p>
                Duration : <span>{duration ? duration : ""}</span>
              </p>
              <p>
                Cost : <span>{cost ? cost : ""}</span>
              </p>
            </label>
          </div>
          {/* <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
            <label htmlFor="costPerKM" >
                Cost Per KM
            </label>
        </div>
        <div className="h-[35px] relative rounded-lg">
            <input
                onChange={(e) => handleUserInput("costPerKM",e.target.value)}
                type="text"
                id="costPerKM"
                defaultValue='1'
                className="outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg"
            />
        </div> */}
          <div>
            {/* <p>Request Ride</p> */}
            <button
              className="outline-none mr-4 mt-4 w-30 h-full bg-[#36a909] py-[1%] px-[7.4%] text-white rounded-lg"
              onClick={() => {
                isChainCorrect
                  ? !Fetched
                    ? calculateRoute()
                    : checkAndRequest()
                  : onSwitchNetwork();
              }}
            >
              {isChainCorrect
                ? !Fetched
                  ? "Check Fare"
                  : "Confirm Ride"
                : "Switch Network"}
            </button>
            {
              <button
                className="outline-none mr-4 mt-4 w-30 h-full bg-[#a90909] py-[1%] px-[7.4%] text-white rounded-lg"
                onClick={() => clearRoute()}
              >
                clear
              </button>
            }
          </div>
        </motion.div>
        <div className="pt-20 lg:pl-20">
          {/* <Map /> */}
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
                  center={center}
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
                  {driversCoordinates !== null &&
                    driversCoordinates.map(
                      (
                        coordinates: any,
                        index: React.Key | null | undefined
                      ) => (
                        <Marker
                          zIndex={100}
                          key={index}
                          position={coordinates}
                          options={{
                            icon: {
                              url: "https://d1a3f4spazzrp4.cloudfront.net/car-types/map70px/product/map-uberx.png",
                              scaledSize: new google.maps.Size(33, 33),
                            },
                          }}
                        />
                      )
                    )}
                  <Marker position={center} />
                  {directionsResponse && (
                    <div>
                      <Marker
                        clickable={false}
                        position={
                          directionsResponse.routes[0].legs[0].start_location
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
                          directionsResponse.routes[0].legs[0].end_location
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
              {/* <Box p={4} borderRadius="lg" m={4} bgColor="white" shadow="base" minW="container.md" zIndex="1"
      >
        <HStack spacing={2} justifyContent="space-between">
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type="text" placeholder="Destination" ref={destinationRef} />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorScheme="linkedin" type="submit" onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              icon={<FaTimes />}
              onClick={clearRoute} aria-label={""}            />
          </ButtonGroup>
        </HStack>
        <HStack margin={1} spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  const { latitude, longitude } = position.coords;
                  const x = { lat: latitude, lng: longitude };
                  setCurr(x);
                  map.panTo(x);
                  map.setZoom(9);
                });
              } else {
                map.panTo(center);
                map.setZoom(9);
              }
            }}
          />
        </HStack>
      </Box> */}
            </div>
          </>
        </div>
      </div>
    </>
  );
};
const SettingPage: NextPage = () => {
  const router = useRouter();
  const initialFormState = {
    distance: "1",
    from: "",
    to: "",
  };
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [isUser, setUser] = useState();
  const { address, isConnected } = useAccount();
  // const [Loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  // const [checkIfNewUser, setIfNewUser] = useState(false);
  // const [userInfo, setUserInfo] = useState<any>([]);
  // const [costPerKM, setCostPerKM] = useState(10);

  const {
    userInfo,
    costPerKM,
    Loading,
    checkIfNewUser,
    setIsConnect,
    setIsActiveRide,
    SetUserActivities,
    onlineDrivers,
    isLocationActive,
  } = useContext(userContext);

  const toastId: any = React.useRef(null);

  const onSwitchNetwork = async () => {
    await switchNetwork?.(chainId.polygonMumbai);
  };

  const requestRide = async (distance: any, from: any, to: any) => {
    if (!isLocationActive) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast("Your Location is not active", {
          hideProgressBar: true,
          type: "warning",
        });
      }
      return;
    }
    if (onlineDrivers?.length == 0) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast("No drivers available at your location", {
          hideProgressBar: true,
          type: "warning",
        });
      }
      return;
    }
    // console.log(formData)
    console.log(distance);
    const ethereum = (window as any).ethereum;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    if (chain?.id !== chainId?.polygonMumbai) {
      await onSwitchNetwork();
    }
    let provider = new ethers.providers.Web3Provider(ethereum);
    // const { distance, from, to} = formData
    // console.log(formData)
    // const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai)

    const walletAddress = address; // first account in MetaMask
    const signer = provider.getSigner(walletAddress);

    // console.log(signer)
    const carContract = new ethers.Contract(contract, ABI, signer);
    const vINRContract = new ethers.Contract(ERC20Contract, ERC20ABI, signer);

    const allowanceAmt = await vINRContract.allowance(address, contract);

    const isUser = await carContract.is_user(address);
    if (!isUser) return console.log("user account not exist");
    console.log(isUser);
    let _value: any = Math.round(distance) * costPerKM;
    console.log(_value);
    _value = _value < 10 ? 10 : _value;
    _value = ethers.utils.parseUnits(`${_value}`, "ether");
    console.log(_value);
    console.log(allowanceAmt);
    if (allowanceAmt < _value) {
      await vINRContract.approve(contract, _value).then(async (tx: any) => {
        console.log("approved");
        const RequestRide = await carContract
          .requestRide(
            Math.round(distance) < 1 ? 1 : Math.round(distance),
            from,
            to,
            { from: address }
          )
          .then((tx: any) => {
            console.log("processing");
            provider.waitForTransaction(tx.hash).then(async () => {
              console.log("New Ride Requested");
              const [getUserActivities, isActiveRide] = await Promise.all([
                carContract.getUserActivities(address),
                carContract.isActiveRide(address),
              ]);
              setIsActiveRide(isActiveRide);
              SetUserActivities(getUserActivities);
              router.push("../rides/active");
              setIsConnect(false);
            });
          });
      });
    } else {
      const RequestRide = await carContract
        .requestRide(
          Math.round(distance) < 1 ? 1 : Math.round(distance),
          from,
          to,
          { from: address }
        )
        .then((tx: any) => {
          console.log("processing");
          provider.waitForTransaction(tx.hash).then(async () => {
            let getUserActivities = await carContract.getUserActivities(
              address
            );
            let isActiveRide = await carContract.isActiveRide(address);
            setIsActiveRide(isActiveRide);
            SetUserActivities(getUserActivities);
            console.log("New Ride Requested");
            router.push("../rides/active");
            setIsConnect(false);
          });
        })

        .catch((e: { message: any }) => {
          console.log(e.message);
          return;
        });
    }
  };

  // useEffect(() => {
  //   if (window.ethereum) {
  //     (window as any).ethereum.on("accountsChanged", function (accounts: any) {
  //       // Time to reload your interface with accounts[0]!
  //       checkUser();
  //       return;
  //     });
  //   }
  // });
  useEffect(() => {
    if (!address) router.push("../login");
    // if(isConnected && isUser) router.push('./account')
    // checkUser();
  });
  // let checkIfNewUser = isConnected && !isUser

  return (
    <div>
      <Head>
        <title id="title">Request Ride</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <main className="p-4 pt-6 lg:px-16 min-h-screen">
          {Loading && <p className="text-center">Loading...</p>}
          {!Loading && (
            <div>
              {/* <div>
                {isConnected && 
                <>
                <button onClick={() => disconnect()}>Disconnect</button>
                <p> Connected to : {address ? address : ''} </p>
                </>
                }
                {!isConnected && <> <button onClick={() => handleConnect()}>Connect Wallet</button> </>}
            </div> */}

              {checkIfNewUser && (
                <>
                  <RequestRide
                    requestRide={requestRide}
                    costPerKM={costPerKM}
                    setFormData={setFormData}
                  />
                </>
              )}
            </div>
          )}
        </main>
      </>
    </div>
  );
};

export default SettingPage;
