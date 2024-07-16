import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  setAuth,
  setRole,
  setUerDetails,
} from "../../../Redux/Slices/AuthSlice.js";
import { useNavigate } from "react-router-dom";
import {requestPermissionAndGetToken} from '../../NotificationHooks/NotificationHooks.js';
import axios from "axios";

const useStaffLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const staffLogin = async (staffDetails) => {
    
    
    if (!staffDetails) {
      
      toast.error("Please provide staff details.");
      return;
    }

    const { email, password } = staffDetails;

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const deviceToken = await requestPermissionAndGetToken();
      const userdetail = {email,password,deviceToken}
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/staff/login`,
        userdetail
      );

      if (data.success) {
        localStorage.setItem(`${data.role}:token`, `Bearer ${data.token}`);
        localStorage.removeItem(process.env.REACT_APP_PARENT_TOKEN_STORAGE_KEY);
        localStorage.removeItem(
          process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY
        );

        dispatch(setAuth(true));
        dispatch(setRole(data.role));// dynamic role from backend
        console.log(data);
        dispatch(
          setUerDetails({
            userId: data.userId,
            schoolId: data.schoolId,
            email: data.email,
            userName: data?.fullName,
            profile: data?.profile,
          })
        );
        navigate(`/dashboard`);
        toast.success("Logged in successfully", {
          position: "bottom-left",
        });
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error("Error during staff login:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    staffLogin,
  };
};

export default useStaffLogin;
