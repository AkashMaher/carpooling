import { motion } from "framer-motion";
import { ethers } from "ethers";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, FC, useState, useContext } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchNetwork,
  useNetwork,
  chainId,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { contract, ABI, RPC } from "../contracts";
import Head from "next/head";
import { opacityAnimation } from "../utils/animations";

import user from "../components/context/user";
const Home = () => {
  const router = useRouter();
  const initialFormState = {
    name: "",
    age: 0,
    gender: "Male",
    phone: "",
    email: "",
    role: 1,
  };
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  // const [isUser, setUser] = useState(false);
  const { address, isConnected } = useAccount();
  const [Loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormState);
  const [checkIfNewUser, setIfNewUser] = useState(false);
  // const [userInfo, setUserInfo] = useState<any>([]);
  // const [isActiveRide, setIsActiveRide] = useState(false);
  // const [userRole, setUserRole] = useState(0);

  const {
    userRole,
    isActiveRide,
    userInfo,
    isUser,
    setUserRole,
    setIsActiveRide,
    setUserInfo,
    setUser,
  } = useContext(user);
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const checkUser = async () => {
    if (!address) {
      setLoading(false);
      setIfNewUser(false);
      setUser(false);
      return;
    }
    if (userInfo?.name || checkIfNewUser) return setLoading(false);
    // let provider = new ethers.providers.Web3Provider(ethereum)
    const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai);

    const walletAddress = address; // first account in MetaMask
    const signer = provider.getSigner(walletAddress);

    // console.log(signer)
    const carContract = new ethers.Contract(contract, ABI, signer);

    const isUser = await carContract.is_user(address);
    let getUser = await carContract.userInfo(address);
    let isActiveRide = await carContract.isActiveRide(address);
    if (!isUser || isConnected) {
      setIfNewUser(true);
    }
    setUserRole((getUser?.role).toNumber());
    setIsActiveRide(isActiveRide);
    setUserInfo(getUser);
    setUser(isUser);
    setLoading(false);
    // console.log(isUser)
  };
  useEffect(() => {
    if (window.ethereum) {
      (window as any).ethereum.on("accountsChanged", function (accounts: any) {
        // Time to reload your interface with accounts[0]!
        setUserInfo([]);
        setLoading(true);
        checkUser();
        return;
      });
    }
  });
  useEffect(() => {
    // if(isConnected && isUser) router.push('./account')
    checkUser();
  });

  const handleClick = (_value: any) => {
    console.log(_value);
    if (!_value) return;
    router.push(`./${_value}`);
  };

  return (
    <div>
      <Head>
        <title id="title">Web3 Carpooling</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <></>
      <div className="container mx-auto text-center pt-16">
        {Loading && <p className="text-center">Loading...</p>}
        {!Loading && (
          <>
            <h1 className="text-3xl xl:text-6xl font-bold ">WEB3 CARPOOLING</h1>
            <div className="cursor-pointer">
              {!isUser && (
                <button
                  className="outline-none mr-4 mt-4 w-30 h-full bg-[#36a909] py-[1%] px-[7.4%] text-white rounded-lg"
                  onClick={() => router.push("/login")}
                >
                  Login
                </button>
              )}
              {isUser && !isUser && (
                <>
                  <button
                    className="outline-none mr-4 mt-4 w-30 h-full bg-[#36a909] py-[1%] px-[7.4%] text-white rounded-lg"
                    onClick={() => handleClick("dashboard")}
                  >
                    Dashboard
                  </button>
                  <button
                    className="outline-none mr-4 mt-4 w-30 h-full bg-[#36a909] py-[1%] px-[7.4%] text-white rounded-lg"
                    onClick={() => handleClick("account")}
                  >
                    Account
                  </button>
                </>
              )}
            </div>
            <div className="pt-20">
              {isUser && (
                <>
                  <button
                    className="text-2xl sm:text-5xl outline-none mr-4 mt-4 w-50 h-full bg-[#36a909] py-[1%] px-[7.4%] text-white rounded-[4rem]"
                    onClick={() => {
                      isActiveRide
                        ? handleClick("rides/active")
                        : !isActiveRide && userRole == 1
                        ? handleClick("rides/request")
                        : !isActiveRide && userRole == 2
                        ? handleClick("rides")
                        : "";
                    }}
                  >
                    {isActiveRide
                      ? "Active Ride"
                      : !isActiveRide && userRole == 1
                      ? "Book A Ride"
                      : !isActiveRide && userRole == 2
                      ? "Check Available Rides"
                      : ""}
                  </button>
                </>
              )}
            </div>
          </>
        )}
        {/* Your home page content here */}
      </div>
    </div>
  );
};

export default Home;
