import { axiosInstance, createAxiosInstance, Instance } from "../axiosInstance";

const axiosFileInstance = createAxiosInstance("form-data");

export const updateDriver = (data: any) => {
  return axiosInstance.post("/api/drivers/update", data);
};

export const getAllDrivers = (userLong: any, userLat: any, distance: any) => {
  return axiosInstance.get(
    `/api/drivers/online/${userLong}/${userLat}/${distance}`
  );
};
