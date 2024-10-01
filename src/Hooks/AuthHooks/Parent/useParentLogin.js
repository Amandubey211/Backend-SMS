import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuth, setRole } from "../../../Redux/Slices/Auth/AuthSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../config/Common.js";

const useParentLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const parentLogin = async (parentDetails) => {
    if (!parentDetails) {
      toast.error("Please provide parent details.");
      return;
    }

    const { email, password } = parentDetails;

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
      const { data } = await axios.post(
        `${baseUrl}/auth/parent/login`,
        parentDetails
      );

      if (data.success) {
        const token = `Bearer ${data.token}`;

        // Save the entire response in localStorage
        localStorage.setItem("userData", JSON.stringify(data));
        localStorage.setItem(`${data.role}:token`, token);
        localStorage.removeItem(process.env.REACT_APP_STAFF_TOKEN_STORAGE_KEY);
        localStorage.removeItem(
          process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY
        );

        dispatch(setAuth(true));
        dispatch(setRole(data.role)); // dynamic role from backend
        navigate(`/parent_dash`);
        toast.success("Logged in successfully", {
          position: "bottom-left",
        });
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      // toast.error(errorMessage);
      console.error("Error during parent login:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    parentLogin,
  };
};

export default useParentLogin;
