import axiosInstance from './axiosInstance';
import { API_PATHS } from './ApiPaths';

export const forgotPassword = async (email) => {
  return axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
};

export const resetPassword = async (token, password) => {
  return axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, { token, password });
};

export const verifyOTP = async (email, otp) => {
  return axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, { email, otp });
};

export const verifyRegistrationOTP = async (email, otp) => {
  return axiosInstance.post(API_PATHS.AUTH.VERIFY_REGISTRATION_OTP, { email, otp });
}; 