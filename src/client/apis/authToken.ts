import { InternalAxiosRequestConfig } from "axios";

let authToken = "";

export const setAuthToken = (value: string) => {
  authToken = value;
  localStorage.setItem("auth", value);
};

export const initAuthToken = () => {
  const token = localStorage.getItem("auth");
  if (token) {
    authToken = token;
  }
  return token;
};

export const authTokenInterseptor = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: InternalAxiosRequestConfig<any>
) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
};
