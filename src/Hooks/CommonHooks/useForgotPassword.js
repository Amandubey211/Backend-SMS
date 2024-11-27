import axios from 'axios';
import { postData } from '../../services/apiEndpoints';


export const forgotPassword = async (email, role) => {
  try {
    return await postData(`/api/password/forgot-password`, { email, role });
  } catch (error) {
    console.error('Error in forgot password:', error);
    throw error.response.data;
  }
};

export const resetPassword = async ({ email, newPassword, confirmPassword, token }) => {
  try {
    return await postData(`/api/password/reset-password`, {
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
