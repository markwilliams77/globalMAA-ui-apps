
import { SendOtpRequest, SendOtpResponse, VerifyOtpRequest, VerifyOtpResponse } from "../models";
import  { api } from "./api";
export const authApi = {
  sendOtp: async (payload: SendOtpRequest) => {
    const { data } = await api.post<SendOtpResponse>("/api/auth/send-otp", payload);
    return data;
  },

  verifyOtp: async (payload: VerifyOtpRequest) => {
    const { data } = await api.post<VerifyOtpResponse>("/api/auth/verify-otp", payload);
    return data;
  },

  logout: () => {
    localStorage.removeItem("auth_token");
  },
};
