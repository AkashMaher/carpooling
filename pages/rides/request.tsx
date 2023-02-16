import { motion } from 'framer-motion'
import { ethers } from 'ethers'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect,FC, useState } from 'react'
import { useAccount, useConnect, useDisconnect,useSwitchNetwork,useNetwork, chainId } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { contract, ABI, RPC } from '../../contracts'
import Head from 'next/head';
import { opacityAnimation } from '../../utils/animations'
// const chainId = '80001'
 type selectDataType = {
  name: string
  value: string
}

const RequestRide: FC<{ handleUserInput: (_name:any, _value: any) => void, requestRide:()=> void
}> = ({ handleUserInput, requestRide }) => {
  const { address } = useAccount()

  return (
    <>
    <motion.div
              className="mt-8"
              variants={opacityAnimation}
              initial="initial"
              whileInView="final"
              viewport={{ once: true }}
              transition={{
                ease: 'easeInOut',
                duration: 1,
                delay: 0.5,
              }}
            >
     <h1 className='text-lg font-bold'>Request a Ride</h1>
     <p>Wallet Address : {address}</p>
     <br></br>
        <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
            <label htmlFor="distance" className="text-white">
                Distance
            </label>
        </div>
        <div className="h-[35px] relative rounded-lg">
            <input
                onChange={(e) => handleUserInput("distance",e.target.value)}
                type="any"
                id="distance"
                defaultValue='1'
                className="outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg"
            />
        </div>
        <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
            <label htmlFor="phone" className="text-white">
                From 
            </label>
        </div>
        <div className="h-[35px] relative rounded-lg">
            <input
                onChange={(e) => handleUserInput("from",e.target.value)}
                type="text"
                id="from"
                className="outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg"
            />
        </div>
        <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
            <label htmlFor="to" className="text-white">
                To
            </label>
        </div>
        <div className="h-[35px] relative rounded-lg">
            <input
                onChange={(e) => handleUserInput("to",e.target.value)}
                type="any"
                id="to"
                className="outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg"
            />
        </div>
        <div className="font-poppins lg:text-[20px] flex justify-between mb-2 mt-3">
            <label htmlFor="costPerKM" className="text-white">
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
        </div>
        <div>
        <p>Request Ride</p>
        <button className="outline-none mr-4 mt-4 w-30 h-full bg-[#36a909] py-[1%] px-[7.4%] text-white rounded-lg" onClick={()=> requestRide()}>Request a Ride</button>
        </div>
    </motion.div>
    </>
  )
}
const SettingPage: NextPage = () => {
    const router = useRouter()
    const initialFormState = {
    distance:'1',
    from: '',
    to: '',
    costPerKM:'1',
  }
    const { chain } = useNetwork()
    const { switchNetwork } = useSwitchNetwork()
    const [isUser,setUser] = useState()
    const { address, isConnected } = useAccount()
    const [Loading,setLoading] = useState(true)
    const [formData, setFormData] = useState(initialFormState)
    const [checkIfNewUser,setIfNewUser] = useState(false)
    const [userInfo,setUserInfo] = useState<any>([])

    const checkUser = async ()=> {
        if(!isConnected) return router.push('../login');
        if(!address) {
            setLoading(false)
            setIfNewUser(false)
            return;
        }
        if(userInfo?.name) return;
        // let provider = new ethers.providers.Web3Provider(ethereum)
        const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai)
        
        const walletAddress = address // first account in MetaMask
        const signer = provider.getSigner(walletAddress)

        // console.log(signer)
        const carContract = new ethers.Contract(contract, ABI, signer)

        const isUser = await carContract.is_user(address)
        if(isUser || isConnected) {
            setIfNewUser(true)
        }
        if(!isUser) return router.push('../login')
        let getUser = await carContract.userInfo(address)
        if((getUser?.role).toNumber() !== 1) return router.push('../rides')
        setUserInfo(getUser)
        setUser(isUser)
        setLoading(false)
        // console.log(isUser)
    }

    useEffect(()=> {
      if (window.ethereum) {
        (window as any).ethereum.on('accountsChanged', function (accounts:any) {
          setUserInfo([]);
          setLoading(true);
          checkUser();
          return;
        })
      }
    })
    const handleUserInput = (_name:any,_value:any) => {
        if(!_name || !_value) return;
        console.log(_value)
        setFormData((prevData) => ({
        ...prevData,
        [_name]: _name=="age"?parseInt(_value):_value,
        }))
    }

    const onSwitchNetwork = async () => {
    await switchNetwork?.(chainId.polygonMumbai)
  }


    const requestRide = async ()=> {
        console.log(formData)
        const ethereum = (window as any).ethereum
        const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
        })
        if(chain?.id !== chainId?.polygonMumbai) {
            await onSwitchNetwork()
        }
        let provider = new ethers.providers.Web3Provider(ethereum)
        const { distance, from, to, costPerKM} = formData
        console.log(formData)
        // const provider = new ethers.providers.JsonRpcProvider(RPC.mumbai)

        const walletAddress = address // first account in MetaMask
        const signer = provider.getSigner(walletAddress)

        // console.log(signer)
        const carContract = new ethers.Contract(contract, ABI, signer)

        const isUser = await carContract.is_user(address)
        if(!isUser) return console.log("user account not exist")
        console.log(isUser)
        let _value = (parseInt(distance))*(parseInt(costPerKM))
        const RequestRide = await carContract.requestRide(distance, from, to, costPerKM, {from:address,value:_value})
        .then((tx: any) => {
          console.log('processing')
          provider.waitForTransaction(tx.hash).then(()=> {
            console.log("New Ride Requested")
            router.push('../rides/active')
          })
        })
        .catch((e: { message: any }) => {
        console.log(e.message)
        return
        })
    }

        useEffect(()=> {
  if (window.ethereum) {
        (window as any).ethereum.on('accountsChanged', function (accounts:any) {
  // Time to reload your interface with accounts[0]!
        checkUser()
        return
        })
  }
})
    useEffect(()=> {
        if(!address) router.push('./login')
        // if(isConnected && isUser) router.push('./account')
        checkUser()
    })
    // let checkIfNewUser = isConnected && !isUser

  return (
    <div>
      <Head>
        <title id="title">Request Ride</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <>
    
    <main className="p-4 pt-6 lg:px-16 min-h-screen">
        {Loading && <p className='text-center'>Loading...</p>}
        {!Loading && 
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
        
            {checkIfNewUser && 
                <>
                <RequestRide handleUserInput={handleUserInput} requestRide={requestRide} />
                </>
            }
        </div>}
    </main>
    </>
    </div>
  )
}

export default SettingPage
