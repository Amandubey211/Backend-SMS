import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetPassword = async (resetPasswordDetails) => {
    setLoading(true);
    try {
      const { newPassword, confirmPassword, studentId } = resetPasswordDetails;

      // Validation: Check if any field is empty
      if (!newPassword || !confirmPassword || !studentId) {
        throw new Error("Please fill all the required details");
      }

      // Validation: Check if passwords match
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Validation: Check password complexity
      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      //   const hasNumber = /\d/.test(newPassword);
      //   const hasUpper = /[A-Z]/.test(newPassword);
      //   const hasLower = /[a-z]/.test(newPassword);
      //   const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      //     newPassword
      //   );

      //   if (!(hasNumber && hasUpper && hasLower && hasSpecial)) {
      //     throw new Error(
      //       "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      //     );
      //   }

      const API_URL = process.env.REACT_APP_API_URL;
      const { data } = await axios.put(
        `${API_URL}/student/reset_password`,
        resetPasswordDetails
      );

      if (data.success) {
        toast.success(data.msg || "Password changed");
        navigate("/studentlogin");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, resetPassword };
};

export default useResetPassword;
