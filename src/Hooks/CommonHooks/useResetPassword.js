import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword as apiResetPassword } from './useForgotPassword';

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const sendForgotPassword = async ({ email, role }) => {
    setLoading(true);
    try {
      const response = await forgotPassword(email, role);
      console.log('response', response)
      if (response.data.success) {
        toast.success('Check your email to reset your password!');
        return response.data;
      } else {
        // Handle the case where success is false
        const errorMessage = response.data.msg || "Failed to reset password. Please try again.";
        toast.error(errorMessage);
        throw new Error(errorMessage); // Throw error to handle it in the catch block
      }
    } catch (error) {
      console.log('error', error);
      const errorMessage = error?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage); // Display error toast
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

      console.log('response---', response)
      if (!response.success) {
        setTimeout(() => {
          navigate('/');
        }, 3000);
        //toast.error(response.msg || 'Failed to reset password.');
        throw new Error(response.msg);
      } else {
        toast.success('Password reset successfully!');
        return response.data;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to reset password.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, resetPassword };

};
