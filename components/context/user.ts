import React from "react";
import { ActivityType } from "../../utils/interfaces";

export interface IUserContextProps {
  userInfo: any;
  userActivities:any[];
   userBalance:any;
   userRole:any;
   isActiveRide:boolean;
   ride:any;
   setUserBalance:(_value:any) => void;
   userContactNumber:String;
   allActiveRides:ActivityType[];
   costPerKM:any;
   setIsConnect:(_value:boolean)=> void;
   isConnect:any;
   Loading:boolean;
   checkIfNewUser:boolean;
   isUser:boolean;
}



const defaultValue: IUserContextProps = {
    userInfo: {},
    userActivities:[],
    userBalance:0,
    userRole:0,
    isActiveRide:false,
    ride:{},
    setUserBalance: () => {},
    userContactNumber:'',
    allActiveRides:[],
    costPerKM:10,
    isConnect:false,
    setIsConnect:()=>{},
    Loading:true,
    checkIfNewUser:false,
    isUser:false
};



export default React.createContext(defaultValue);