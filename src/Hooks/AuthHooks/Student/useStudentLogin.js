import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../Redux/Slices/AuthSlice.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const TOKEN_STORAGE_KEY = process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY;

const useStudentLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const studentLogin = async (studentDetails) => {
    try {
      setLoading(true);
      const { email, password } = studentDetails;
      if (!email || !password) {
        toast.error("Please provide email and password.");
        return;
      }

      const { data } = await axios.post(
        `${API_URL}/student/student_login`,
        studentDetails
      );
      console.log(data);

      if (data.success) {
        dispatch(setAuth(true));
        toast.success("Logged in successfully");
        localStorage.setItem(TOKEN_STORAGE_KEY, `Bearer ${data.token}`);
        navigate(data.isVerifiedSchoolId && "/dash");
      } else {
        toast.error(data.msg || "Login unsuccessful");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    studentLogin,
  };
};

export default useStudentLogin;
