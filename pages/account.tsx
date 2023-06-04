import { motion } from "framer-motion";
import { ethers } from "ethers";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  useAccount,
  useSwitchNetwork,
  useNetwork,
  chainId,
} from "wagmi";
import { opacityAnimation } from "../utils/animations";
import Head from "next/head";

import userContext from "../components/context/user";

const AccountPage: NextPage = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  const { userInfo, Loading } = useContext(userContext);


  let time = "";
  if (userInfo?.time) {
    let d = new Date((userInfo?.time).toNumber() * 1000);
    time = d.toLocaleString();
  }

  return (
    <div>
      <Head>
        <title id="title">My Account</title>
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
                  delay: 0.4,
                }}
              >
                <div>
                  <h1 className="text-2xl font-bold ">Account Info</h1>
                  <br></br>
                  <ul>
                    <li>User Id: {`${userInfo?.user_id?.toNumber()}`}</li>
                    <li>Name: {userInfo?.name}</li>
                    <li>Wallet Address: {address ? address : ""}</li>
                    <li>Mobile Number: {userInfo?.phone}</li>
                    <li>Email Id: {userInfo?.email}</li>
                    <li>Age: {userInfo?.age?.toNumber()}</li>
                    <li>
                      Role:{" "}
                      {userInfo?.role?.toNumber() == 2
                        ? "Driver"
                        : userInfo.role?.toNumber() == 1
                        ? "Passenger"
                        : ""}
                    </li>
                    <li>Account Created At : {time}</li>
                  </ul>
                </div>
                <br></br>
                <p></p>
                <button
                  className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg"
                  onClick={() => {
                    router.push("./dashboard");
                  }}
                >
                  Dashboard
                </button>
                <button
                  className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg"
                  onClick={() => {
                    router.push("./setting");
                  }}
                >
                  Account Setting
                </button>
              </motion.div>
            </>
          )}
        </main>
      </>
    </div>
  );
};

export default AccountPage;
