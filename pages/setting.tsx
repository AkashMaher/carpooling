import { motion } from "framer-motion";
import { ethers } from "ethers";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, FC, useState } from "react";
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
// const chainId = '80001'
type selectDataType = {
  name: string;
  value: string;
};

const UpdateAccount: FC<{
  handleUserInput: (_name: any, _value: any) => void;
  updateUser: () => void;
  deleteUser: () => void;
  userInfo: any;
}> = ({ handleUserInput, updateUser, userInfo, deleteUser }) => {
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
        <h1 className="text-lg font-bold">Update Account Info</h1>
        <p>Wallet Address : {address}</p>
        <br></br>
        <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
          <label htmlFor="name">Name</label>
        </div>
        <div className="h-[35px] relative rounded-lg">
          <input
            onChange={(e) => handleUserInput("name", e.target.value)}
            type="any"
            id="name"
            defaultValue={userInfo?.name}
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
            defaultValue={userInfo?.phone}
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
            defaultValue={userInfo?.email}
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
            defaultValue={userInfo?.age}
            className="outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg"
          />
        </div>
        <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
          <label htmlFor="gender">Gender</label>
        </div>
        <div className="h-[35px] relative rounded-lg">
          <select
            className="outline-none w-30 h-full bg-[#585858] px-[8.9%] text-white rounded-lg"
            id="gender"
            name="gender"
            onChange={(e) => handleUserInput("gender", e.target.value)}
            defaultValue={userInfo?.gender}
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
            className="outline-none w-30 h-full bg-[#585858] px-[8.6%] text-white rounded-lg"
            id="role"
            name="role"
            onChange={(e) => handleUserInput("role", e.target.value)}
            defaultValue={userInfo?.role}
          >
            <option value="1">Passenger</option>
            <option value="2">Driver</option>
          </select>
        </div>
        <div>
          {/* <p>Update Your Account</p> */}
          <button
            className="outline-none mr-4 mt-4 w-30 h-full bg-[#36a909] py-[1%] px-[7.4%] text-white rounded-lg"
            onClick={() => updateUser()}
          >
            Update Account
          </button>
          {/* <p>Delete Your Account</p> */}
          <button
            className="outline-none mr-4 mt-4 w-30 h-full bg-[#ff1212] py-[1%] px-[7.5%] text-white rounded-lg"
            onClick={() => deleteUser()}
          >
            Delete Account
          </button>
        </div>
      </motion.div>
    </>
  );
};
const SettingPage: NextPage = () => {
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
  const [isUser, setUser] = useState();
  const { address, isConnected } = useAccount();
  const [Loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormState);
  const [checkIfNewUser, setIfNewUser] = useState(false);
  const [userInfo, setUserInfo] = useState<any>([]);
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    setLoading(true);
    await connect();
    await checkUser();
  };

  console.log(isConnected);
  const checkUser = async () => {
    if (!isConnected) return router.push("./login");
    if (!address) {
      setLoading(false);
      setIfNewUser(false);
      return;
    }
    if (userInfo?.name) return;
    // let provider = new ethers.providers.Web3Provider(ethereum)
    const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai);

    const walletAddress = address; // first account in MetaMask
    const signer = provider.getSigner(walletAddress);

    // console.log(signer)
    const carContract = new ethers.Contract(contract, ABI, signer);

    const isUser = await carContract.is_user(address);
    if (isUser || isConnected) {
      setIfNewUser(true);
    }
    if (!isUser) return router.push("./login");
    let getUser = await carContract.userInfo(address);
    setUserInfo(getUser);
    setUser(isUser);
    setLoading(false);
    initialFormState["name"] = getUser?.name;
    initialFormState["age"] = (getUser?.age).toNumber();
    initialFormState["gender"] = getUser?.gender;
    initialFormState["role"] = (getUser?.role).toNumber();
    initialFormState["phone"] = getUser?.phone;
    initialFormState["email"] = getUser?.email;
    setFormData(initialFormState);
    // console.log(isUser)
  };

  useEffect(() => {
    if (window.ethereum) {
      (window as any).ethereum.on("accountsChanged", function (accounts: any) {
        setUserInfo([]);
        setLoading(true);
        checkUser();
        return;
      });
    }
  });
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

  const updateUser = async () => {
    console.log(formData);
    const ethereum = (window as any).ethereum;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    if (chain?.id !== chainId?.polygonMumbai) {
      await onSwitchNetwork();
    }
    let provider = new ethers.providers.Web3Provider(ethereum);

      const data = {
      name: (document.getElementById('name') as HTMLInputElement)?.value,
      age : (document.getElementById('age') as HTMLInputElement)?.value,
      gender: (document.getElementById('gender') as HTMLInputElement)?.value,
      phone : (document.getElementById('phone') as HTMLInputElement)?.value,
      email : (document.getElementById('email') as HTMLInputElement)?.value,
      role: (document.getElementById('role') as HTMLInputElement)?.value,
      };

    const { name, age, gender, phone, email, role } = data;
    // console.log(data);
    // const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai)

    const walletAddress = address; // first account in MetaMask
    const signer = provider.getSigner(walletAddress);

    // console.log(signer)
    const carContract = new ethers.Contract(contract, ABI, signer);

    const isUser = await carContract.is_user(address);
    if (!isUser) return console.log("user account not exist");
    console.log(isUser);
    const updateAccount = await carContract
      .updateUser(name, age, gender, phone, email, role)
      .then((tx: any) => {
        console.log("processing");
        provider.waitForTransaction(tx.hash).then(() => {
          console.log("User Account Updated");
          router.push("./account");
        });
      })
      .catch((e: { message: any }) => {
        console.log(e.message);
        return;
      });
  };

  const deleteUser = async () => {
    if (!address) return;
    const ethereum = (window as any).ethereum;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    if (chain?.id !== chainId?.polygonMumbai) {
      await onSwitchNetwork();
    }
    let provider = new ethers.providers.Web3Provider(ethereum);

    const signer = provider.getSigner(address);

    // console.log(signer)
    const carContract = new ethers.Contract(contract, ABI, signer);

    const isUser = await carContract.is_user(address);
    if (!isUser) return console.log("User Not Found");
    const deleteAccount = await carContract
      .deleteUser()
      .then((tx: any) => {
        console.log("processing");
        provider.waitForTransaction(tx.hash).then(() => {
          console.log("User Account Deleted");
          router.push("./login");
        });
      })
      .catch((e: { message: any }) => {
        console.log(e.message);
        return;
      });
  };
  useEffect(() => {
    if (window.ethereum) {
      (window as any).ethereum.on("accountsChanged", function (accounts: any) {
        // Time to reload your interface with accounts[0]!
        checkUser();
        return;
      });
    }
  });
  useEffect(() => {
    if (!address) router.push("./login");
    // if(isConnected && isUser) router.push('./account')
    checkUser();
  });
  // let checkIfNewUser = isConnected && !isUser

  return (
    <div>
      <Head>
        <title id="title">Setting</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <main className="p-4 pt-6 lg:px-16 min-h-screen text-center">
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
                  <UpdateAccount
                    handleUserInput={handleUserInput}
                    updateUser={updateUser}
                    deleteUser={deleteUser}
                    userInfo={userInfo}
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
