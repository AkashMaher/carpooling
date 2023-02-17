import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useAccount } from 'wagmi'
import { ActivityType, UserType } from '../utils/interfaces'

import { shortenString } from '../utils'
import { opacityAnimation } from '../utils/animations'
import Pagination from './Pagination'
const ActivityItem: FC<{
  activity: ActivityType
  index: number
  handleRide:(ride:ActivityType)=> void
}> = ({ activity, index, handleRide }) => {
  const router = useRouter()
  const { address: connectedAddress } = useAccount()



//   let timePlaced = ''
//   if (activity?.createdAt) {
//     let d = new Date(activity.createdAt)
//     timePlaced = d.toLocaleString()
//   }

  const isTo = activity?.driver !== '0x0000000000000000000000000000000000000000'
  // const isTx = activity?.transaction_hash
  const isTx = undefined
  const CostPerKM = (activity?.costPerKM).toNumber()
  const eventIn = (activity?.status).toNumber()
  const distance = (activity?.distance).toNumber()

  const activityData = [
    { name: 'Ride ID', value:(activity?.id).toNumber()},
    { name: 'Distance', value: distance},
    { name: 'Driver',value:activity?.driver == connectedAddress?"You":!isTo?"-":shortenString(activity?.driver,3,3) },
    { name: 'Traveller',value:activity?.traveller == connectedAddress?"You":shortenString(activity?.traveller,3,3) },
    { name: 'CostPerKM',value:CostPerKM },
    { name: 'From',value:activity?.from },
    { name: 'To',value:activity?.to },
    {name: 'Accept',value:'Accept'}
  ]

  const onClickAddress = (address: string) => {
    let explorer = 'mumbai.polygonscan.com'
      let url = `https://${explorer}/address/${address}`
      window.open(url, '_blank')
  }

  

  return (
    <motion.tr
      className={`${
        index % 2 === 0 ? 'bg-[#070707]' : 'bg-transparent'
      } font-poppins text-[#D7D7D7] lg:text-lg py-2 h-16`}
      variants={opacityAnimation}
      initial="initial"
      whileInView="final"
      viewport={{ once: true }}
      transition={{
        ease: 'easeInOut',
        duration: 0.4,
        delay: index < 6 ? 0.1 * index : 0,
      }}
    >
      {activityData?.map((activityData, index) => (
        <td
          key={index}
          className={activityData?.name === 'Traveller' ||
            (isTo && activityData?.name === 'Driver')
              ? 'cursor-pointer underline hover:text-sky-500'
              : activityData?.name === 'Accept'?'cursor-pointer underline hover:text-green-500':'h-16'}
          onClick={() =>
            activityData?.name === 'Traveller'
              ? onClickAddress(activity?.traveller)
              : isTo && activityData?.name === 'Driver'
              ? onClickAddress(activity?.driver)
              : activityData?.name === 'Accept'?handleRide(activity):''
          }
        >
          {activityData?.value}
        </td>
      ))}
    </motion.tr>
  )
}

type InitialActivityStateType = {
  activity: ActivityType[] | undefined
  totalPages: number
  currentPage: number
}

const INITIAL_ACTIVITY_STATE: InitialActivityStateType = {
  activity: undefined,
  totalPages: 1,
  currentPage: 1,
}

const AllRides: FC<{ userActivities:ActivityType[], handleRide:(ride:ActivityType)=> void}> = ({ userActivities,handleRide }) => {

    const [{ activity, totalPages, currentPage }, setActivityState] = useState(
    INITIAL_ACTIVITY_STATE
  )

  const handlePaginate = (pageNumber: number) => {
    setActivityState((prev) => ({ ...prev, currentPage: pageNumber }))
  }


  const tableHeadings = [
    { name: 'Ride ID'},
    { name: 'Distance' },
    { name: 'Driver' },
    { name: 'Traveller' },
    { name: 'CostPerKM' },
    { name: 'From' },
    { name: 'To' },
    { name: 'Accept'}
  ]
  return (
    <>
      <div
        className="pb-20 md:px-4 bg-[#1F2021] rounded-lg
  gap-20 w-full  max-w-full mx-auto px-2 lg:px-6 py-9 lg:h-[928px] scrollbar-thin scrollbar-thumb-[#5A5B61] scrollbar-thumb-rounded-lg scrollbar-track-[#1F2021] overflow-y-scroll"
      >
        <div
          className="w-full font-poppins text-[#D7D7D7] lg:text-lg px-0 max-h-full 
      overflow-y-scroll scrollbar-thin scrollbar-thumb-[#5A5B61] scrollbar-thumb-rounded-lg scrollbar-track-[#1F2021]"
        >
          {userActivities?.length ? (
            <table className="w-full overflow-x-auto text-center">
              <thead>
                <tr className="h-16">
                  {tableHeadings.map((heading) => (
                    <th key={heading.name} className="h-16">
                      {heading.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userActivities?.length &&
                  userActivities?.map((activity, index) => {
                    return (
                      <ActivityItem
                        key={index}
                        activity={activity}
                        handleRide={handleRide}
                        index={index}
                      />
                    )
                  })}
                {/* {activity?.length === 0 && <td>Activites</td>} */}
              </tbody>
            </table>
          ) : (
            ''
          )}
          {!userActivities?.length && (
            <p className="text-center b text-3xl p-12">- No Available Rides -</p>
          )}
        </div>
      </div>
      <div className="flex justify-end p-4 pb-10">
        <Pagination
          totalPages={totalPages}
          paginate={handlePaginate}
          currentPage={currentPage}
        />
      </div>
    </>
  )
}

export default AllRides