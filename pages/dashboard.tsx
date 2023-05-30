import { motion } from "framer-motion";
import { ethers } from "ethers";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
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
import { add } from "date-fns";
import { opacityAnimation } from "../utils/animations";
import UserActivity from "../components/UserActivity";
import Head from "next/head";
import userContext from "../components/context/user";
const DashboardPage: NextPage = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  // const [Loading, setLoading] = useState(false);
  // const [userInfo, setUserInfo] = useState<any>([]);

  // const [isActiveRide, setIsActiveRide] = useState(false);
  // const [userRole, setUserRole] = useState(0);
  // const [userBalance, setUserBalance] = useState(0);
  // const [userActivities, SetUserActivities] = useState<any>([]);
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const {
    userInfo,
    userActivities,
    userRole,
    isActiveRide,
    userBalance,
    setUserBalance,
    Loading,
  } = useContext(userContext);
  // const checkUser = async () => {
  //   if (!isConnected) return router.push("./login");
  //   if (userInfo?.name) return;
  //   // let provider = new ethers.providers.Web3Provider(ethereum)
  //   // const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai);

  //   // const walletAddress = address; // first account in MetaMask
  //   // const signer = provider.getSigner(walletAddress);

  //   // // console.log(signer)
  //   // const carContract = new ethers.Contract(contract, ABI, signer);

  //   // const isUser = await carContract.is_user(address);
  //   // if (!isUser) return router.push("./login");
  //   // // console.log(isUser)
  //   // let getUser = await carContract.userInfo(address);
  //   // let isActiveRide = await carContract.isActiveRide(address);
  //   // let balance = await carContract.balance(address);
  //   // let getUserActivities = await carContract.getUserActivities(address);
  //   setUserRole((getUser?.role).toNumber());
  //   SetUserActivities(getUserActivities);
  //   setUserBalance(balance.toNumber());
  //   setIsActiveRide(isActiveRide);
  //   setUserInfo(getUser);
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   if (window.ethereum) {
  //     (window as any).ethereum.on("accountsChanged", function (accounts: any) {
  //       setUserInfo([]);
  //       setLoading(true);
  //       checkUser();
  //       return;
  //     });
  //   }
  // });

  // useEffect(() => {
  //   checkUser();
  // });

  const onSwitchNetwork = async () => {
    await switchNetwork?.(chainId.polygonMumbai);
  };

  const handleClaim = async () => {
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
    if (userBalance == 0) return console.log("No balance to claim");
    const claim = await carContract
      .claim()
      .then((tx: any) => {
        console.log("processing");
        provider.waitForTransaction(tx.hash).then(async () => {
          console.log("Claimed Successfully");
          let balance = await carContract.balance(address);
          setUserBalance(balance.toNumber());
          // router.push('../rides/active')
        });
      })
      .catch((e: { message: any }) => {
        console.log(e.message);
        return;
      });
  };

  return (
    <div>
      <Head>
        <title id="title">User Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <main className="p-4 pt-6 lg:px-16 min-h-screen">
          {Loading && <p className="text-center">Loading...</p>}
          {userInfo && !Loading && (
            <>
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
                {userInfo?.role == 2 && (
                  <div>
                    <h1 className="text-2xl font-bold ">User Dashboard</h1>
                    <br></br>
                    <p>Available Balance: {userBalance} INR</p>
                    <button
                      className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg"
                      onClick={() => handleClaim()}
                    >
                      claim
                    </button>
                  </div>
                )}
                <br></br>
                {/* <p>Account setting</p> */}
                <button
                  className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg"
                  onClick={() => {
                    router.push("./account");
                  }}
                >
                  My Account
                </button>
                {isActiveRide && (
                  <button
                    className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg"
                    onClick={() => {
                      router.push("./rides/active");
                    }}
                  >
                    Current Ride
                  </button>
                )}
                {!isActiveRide && userRole == 1 && (
                  <button
                    className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg"
                    onClick={() => {
                      router.push("./rides/request");
                    }}
                  >
                    Request A Ride
                  </button>
                )}
                {!isActiveRide && userRole == 2 && (
                  <button
                    className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg"
                    onClick={() => {
                      router.push("./rides");
                    }}
                  >
                    Available Rides
                  </button>
                )}
                <button
                  className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg"
                  onClick={() => {
                    router.push("./setting");
                  }}
                >
                  Account Setting
                </button>
                <br></br>
                <br></br>
                <h1 className="text-2xl font-bold ">User Activities</h1>
                <br></br>
                <br></br>
              </motion.div>
              <br></br>
              <UserActivity userActivities={userActivities} />
            </>
          )}
        </main>
      </>
    </div>
  );
};

export default DashboardPage;
