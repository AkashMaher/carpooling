/* eslint-disable react-hooks/exhaustive-deps */
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
import useIsMounted from "../utils/hooks/useIsMounted";
import userContext from "../components/context/user";
// const chainId = '80001'
type selectDataType = {
  name: string;
  value: string;
};

const CreateAccount: FC<{
  handleUserInput: (_name: any, _value: any) => void;
  createUser: () => void;
}> = ({ handleUserInput, createUser }) => {
  const { address } = useAccount();
  const [currentTab, setCurrentTab] = useState<"assets" | "activity">("assets");

  return (
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
        <div>
          <p>New User : Create Account</p>
        </div>
        <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
          <label htmlFor="name">Name</label>
        </div>
        <div className="h-[35px] relative rounded-lg">
          <input
            onChange={(e) => handleUserInput("name", e.target.value)}
            type="any"
            id="name"
            className="outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg"
          />
        </div>
        <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
          <label htmlFor="phone">Mobile Number</label>
        </div>
        <div className="h-[35px] relative rounded-lg">
          <input
            onChange={(e) => handleUserInput("phone", e.target.value)}
            type="text"
            id="phone"
            className="outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg"
          />
        </div>
        <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
          <label htmlFor="email">Email Id</label>
        </div>
        <div className="h-[35px] relative rounded-lg">
          <input
            onChange={(e) => handleUserInput("email", e.target.value)}
            type="any"
            id="email"
            className="outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg"
          />
        </div>
        <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
          <label htmlFor="age">Age</label>
        </div>
        <div className="h-[35px] relative rounded-lg">
          <input
            onChange={(e) => handleUserInput("age", e.target.value)}
            type="text"
            id="age"
            className="outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg"
          />
        </div>
        <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
          <label htmlFor="gender">Gender</label>
        </div>
        <div className="h-[35px] relative rounded-lg">
          <select
            className="outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg"
            id="gender"
            name="gender"
            onChange={(e) => handleUserInput("gender", e.target.value)}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
          <label htmlFor="role">Role</label>
        </div>
        <div className="h-[35px] relative rounded-lg">
          <select
            className="outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg"
            id="role"
            name="role"
            onChange={(e) => handleUserInput("role", e.target.value)}
          >
            <option value="1">Passenger</option>
            <option value="2">Driver</option>
          </select>
        </div>
        <div>
          <p>
            You are agree with our terms and conditions by creating account{" "}
          </p>
          <button
            className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg"
            onClick={() => createUser()}
          >
            Create Account
          </button>
        </div>
      </motion.div>
    </>
  );
};
const ConnectPage: NextPage = () => {
  const router = useRouter();
  const initialFormState = {
    name: "",
    age: 0,
    gender: "Male",
    phone: "",
    email: "",
    role: 1,
  };
  const isMounted = useIsMounted();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  // const [isUser, setUser] = useState();
  const { address, isConnected } = useAccount();
  const [Loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormState);
  const [checkIfNewUser, setIfNewUser] = useState(true);
  const [dataFetched, setDataFetched] = useState(false)
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { setIsConnect, isUser, setUser } = useContext(userContext);

  const handleConnect = async () => {
    setLoading(true);
    await connect();
    await checkUser();
    setIsConnect(false);
    setLoading(false);
  };

  const checkUser = async () => {
    if (!address) {
      setLoading(false);
      setIfNewUser(true);
      return console.log("hell");
    }
    // let provider = new ethers.providers.Web3Provider(ethereum)
    const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai);

    const walletAddress = address; // first account in MetaMask
    const signer = provider.getSigner(walletAddress);

    // console.log(signer)
    const carContract = new ethers.Contract(contract, ABI, signer);

    const is_user = await carContract.is_user(address);
    if (is_user) {
      setIfNewUser(!is_user);
    } else {
      setIfNewUser(!is_user);
    }
    let checkk = isConnected && is_user && router.back.name;
    if (checkk) router.back();
    setUser(is_user);
    setLoading(false);
    console.log("is User :", is_user);
    setDataFetched(true)
  };

  const handleUserInput = (_name: any, _value: any) => {
    if (!_name || !_value) return;
    console.log(_value);
    setFormData((prevData) => ({
      ...prevData,
      [_name]: _name == "age" ? parseInt(_value) : _value,
    }));
  };

  const onSwitchNetwork = async () => {
    await switchNetwork?.(chainId.polygonMumbai);
  };

  const createUser = async () => {
    console.log(formData);
    const ethereum = (window as any).ethereum;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    if (chain?.id !== chainId?.polygonMumbai) {
      await onSwitchNetwork();
    }
    let provider = new ethers.providers.Web3Provider(ethereum);
    const { name, age, gender, phone, email, role } = formData;
    // const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai)

    const walletAddress = address; // first account in MetaMask
    const signer = provider.getSigner(walletAddress);

    // console.log(signer)
    const carContract = new ethers.Contract(contract, ABI, signer);

    const isUser = await carContract.is_user(address);
    if (isUser) return console.log("user already exist");
    // console.log(isUser)
    const createAccount = await carContract
      .createUser(name, age, gender, phone, email, role)
      .then((tx: any) => {
        console.log("processing");
        provider.waitForTransaction(tx.hash).then(() => {
          console.log("User Account Created");
          router.push("./account");
        });
      })
      .catch((e: { message: any }) => {
        console.log(e.message);
        return;
      });
  };
  useEffect(() => {
    console.log("hello");
    if (window.ethereum) {
      (window as any).ethereum.on("accountsChanged", function (accounts: any) {
        // Time to reload your interface with accounts[0]!
        checkUser();
        return;
      });
    }
  });


  useEffect(() => {
    if (isConnected) {
      checkUser();
      if (isMounted && !checkIfNewUser) {
        if (isUser && router.back.name) {
          router.back();
        } else {
          router.push("/");
        }
      }
    }
  });

  // let checkIfNewUser = isConnected && !isUser

  return (
    <div>
      <Head>
        <title id="title">Login/Sign Up</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <main className="p-4 pt-6 lg:px-16 min-h-screen">
          {!isMounted && <p className="text-center">Loading...</p>}
          {isMounted && (
            <div>
              <h1 className="text-2xl font-bold">
                {!isConnected
                  ? "Login with metamask"
                  : !isUser
                  ? "Sign Up"
                  : "Login"}
              </h1>
              <div>
                {isConnected && (
                  <>
                    <button onClick={() => disconnect()}>Disconnect</button>
                    <p> Connected to : {address ? address : ""} </p>
                  </>
                )}
                {!isConnected && (
                  <>
                    {" "}
                    <br></br>{" "}
                    {/* <button onClick={() => handleConnect()}>
                      Connect Wallet
                    </button>{" "} */}
                    <div className="justify-center">
                      <button
                        className="outline-none mr-4 mt-4 w-30 h-full bg-[#36a909] py-[1%] px-[7.4%] text-white rounded-lg"
                        onClick={() => handleConnect()}
                      >
                        Connect Wallet
                      </button>
                    </div>
                  </>
                )}
              </div>

              {checkIfNewUser && dataFetched && (
                <>
                  <CreateAccount
                    handleUserInput={handleUserInput}
                    createUser={createUser}
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

export default ConnectPage;
