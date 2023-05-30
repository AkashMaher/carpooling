import React from "react";
import { ActivityType } from "../../utils/interfaces";

export interface IUserContextProps {
  userInfo: any;
  userActivities: any[];
  userBalance: any;
  userRole: any;
  isActiveRide: boolean;
  ride: any;
  setUserBalance: (_value: any) => void;
  userContactNumber: String;
  allActiveRides: ActivityType[];
  costPerKM: any;
  setIsConnect: (_value: boolean) => void;
  isConnect: any;
  Loading: boolean;
  checkIfNewUser: boolean;
  isUser: boolean;
  setRide: (_value: any) => void;
  setIsActiveRide: (_value: boolean) => void;
  setUser: (_value: boolean) => void;
  setUserRole: (_value: any) => void;
  setUserInfo: (_value: any) => void;
  setLoading: (_value: boolean) => void;
  SetUserActivities: (_value: any) => void;
  setDrivers: (_value: any) => void;
  onlineDrivers: any[];
  isLocationActive: boolean;
}

const defaultValue: IUserContextProps = {
  userInfo: {},
  userActivities: [],
  userBalance: 0,
  userRole: 0,
  isActiveRide: false,
  ride: {},
  setUserBalance: () => {},
  userContactNumber: "",
  allActiveRides: [],
  costPerKM: 10,
  isConnect: false,
  setIsConnect: () => {},
  Loading: true,
  checkIfNewUser: false,
  isUser: false,
  setRide: () => {},
  setIsActiveRide: () => {},
  setUser: () => {},
  setUserRole: () => {},
  setUserInfo: () => {},
  setLoading: () => {},
  SetUserActivities: () => {},
  setDrivers: () => {},
  onlineDrivers: [],
  isLocationActive: false,
};

export default React.createContext(defaultValue);
