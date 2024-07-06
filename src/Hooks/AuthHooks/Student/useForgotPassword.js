import axios from 'axios';

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post('http://localhost:8080/api/password/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Error in forgot password:', error);
    throw error.response.data;
  }
};
