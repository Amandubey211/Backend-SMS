import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword as apiResetPassword } from './useForgotPassword';

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const sendForgotPassword = async ({ email }) => {
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      toast.success('Check your email to reset your password!');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendForgotPassword };
};

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetPassword = async ({ email, newPassword, confirmPassword, token }) => {
    setLoading(true);
    try {
      const response = await apiResetPassword({ email, newPassword, confirmPassword, token });
      toast.success('Password reset successfully!');
      navigate('/');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to reset password.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, resetPassword };

};
