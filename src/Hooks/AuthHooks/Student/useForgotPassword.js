import axios from 'axios';
import { baseUrl } from '../../../config/Common';


export const forgotPassword = async (email, role) => {
  console.log("role--", role);

  try {
    return await axios.post(`${baseUrl}/api/password/forgot-password`, { email, role });
  } catch (error) {
    console.error('Error in forgot password:', error);
    throw error.response.data;
  }
};

export const resetPassword = async ({ email, newPassword, confirmPassword, token }) => {
  try {
    return await axios.post(`${baseUrl}/api/password/reset-password`, {
      email,
      newPassword,
      confirmPassword,
      token
    });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    throw error.response.data;
  }
};
