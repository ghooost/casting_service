import axios from "axios";

import { authTokenInterseptor } from "./authToken";

import { SignInRequestBody, SignInResponseBody } from "@shared/auth";
import { BodyWithStatus } from "@shared/express";

export const NO_CONNECTION_ERROR = 0;

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(authTokenInterseptor);

const checkSession = async () => {
  const response = await api.get<BodyWithStatus>(`/check`);
  return response.data;
};

const signIn = async (body: SignInRequestBody) => {
  const response = await api.post<SignInResponseBody>(`/in`, body);
  return response.data;
};

const signOut = async () => {
  const response = await api.get<BodyWithStatus>(`/out`);
  return response.data;
};

export const authApi = {
  checkSession,
  signIn,
  signOut,
};
