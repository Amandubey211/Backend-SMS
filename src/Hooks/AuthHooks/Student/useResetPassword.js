import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { forgotPassword } from './useForgotPassword';
import { useNavigate } from "react-router-dom";

const useResetPassword = () => {
  const [loading, setLoading] = useState(false);

  const resetPassword = async ({ email }) => {
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      return response;
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, resetPassword };
};

export default useResetPassword;
