import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const forgotPassword = async (email) => {
  try {
    return await axios.post(`${API_URL}/api/password/forgot-password`, { email });
  } catch (error) {
    console.error('Error in forgot password:', error);
    throw error.response.data;
  }
};

export const resetPassword = async ({ email, newPassword, confirmPassword, token }) => {
  try {
    return await axios.post(`${API_URL}/api/password/reset-password`, {
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
