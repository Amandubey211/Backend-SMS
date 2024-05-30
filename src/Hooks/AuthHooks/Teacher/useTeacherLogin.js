import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../Redux/Slices/AuthSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TOKEN_STORAGE_KEY = process.env.REACT_APP_ADMIN_TOKEN_STORAGE_KEY;

const useTeacherLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const teacherLogin = async (teacherDetails) => {
    if (!teacherDetails) {
      toast.error("Please provide teacher details.");
      return;
    }

    const { email, password } = teacherDetails;
    console.log(teacherDetails);

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
        `${process.env.REACT_APP_API_URL}/admin/staff_login`,
        teacherDetails
      );

      if (data.success) {
        localStorage.setItem(TOKEN_STORAGE_KEY, `Bearer ${data.token}`);
        dispatch(setAuth(true));
        navigate("/dash");
        toast.success("Teacher Logged In successfully", {
          position: "bottom-left",
        });
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error("Error during teacher login:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    teacherLogin,
  };
};

export default useTeacherLogin;
