import axios, { AxiosInstance } from "axios";

const baseURL = process.env.NEXT_PUBLIC_APIURL || "";

export const axiosInstance = axios.create({
  baseURL,
});

export const Instance = axios.create({});

export const createAxiosInstance = (
  type?: "json" | "form-data"
): AxiosInstance => {
  let headers = {
    "Content-Type": "application/json",
  };

  if (type === "form-data") {
    headers = {
      "Content-Type": "multipart/form-data",
    };
  }

  return axios.create({
    baseURL,
    headers,
  });
};
