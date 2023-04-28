import { useRouter } from 'next/router'
import { FC, ReactNode } from 'react'
// import Footer from './Footer'

import Header from './Header'
// import Detector from './NetworkDetector'

interface LayoutProps {
  children: ReactNode
}

const Buffer = () => {
  const router = useRouter()
  // if (router.asPath === '/') {
  //   return null
  // }
  return <div className="bg-transparent w-full h-[100px]"></div>
}

const CurrentFooter = () => {
  const router = useRouter()
  if (router.asPath === '/') {
    return null
  }
  // return <Footer />
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex justify-center bg-gradient-to-r from-dark_mild to-dark_heavy">
      <div className=" w-full max-w-[1920px] bg-fixed bg-cover bg-market">
        <video
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
      </video>
        {/* <Detector /> */}
        <Header />
        <Buffer />
        {/* <Loading /> */}
        {children}
        {/* <CurrentFooter /> */}
      </div>
    </div>
  )
}

export default Layout
