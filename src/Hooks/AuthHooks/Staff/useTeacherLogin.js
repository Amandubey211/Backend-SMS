import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuth, setRole } from "../../../Redux/Slices/AuthSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import axios from "axios";

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
      // console.log(process.env.REACT_APP_API_URL);
      // const { data } = await axios.post(
      //   `${process.env.REACT_APP_API_URL}/auth/staff/login`,
      //   // `${process.env.REACT_APP_API_URL}/auth/user_login`,
      //   teacherDetails
      // );

      // if (data.success) {
      //   console.log(TOKEN_STORAGE_KEY);
      //   localStorage.setItem(TOKEN_STORAGE_KEY, `Bearer ${data.token}`);
      //   localStorage.removeItem(process.env.REACT_APP_PARENT_TOKEN_STORAGE_KEY);
      //   localStorage.removeItem(
      //     process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY
      //   );

      //   dispatch(setAuth(true));
      //   dispatch(setRole("admin"));
      //   navigate("/admin_dash");
      //   toast.success("Teacher Logged In successfully", {
      //     position: "bottom-left",
      //   });
      // } else {
      //   toast.error(data.message || "Login failed. Please try again.");
      // }
      // if (email === "demo@studentdiwan.com" && password === "studentdiwan123@") {
        dispatch(setAuth(true));
        dispatch(setRole("admin"));
        navigate("/admin_dash");
      // }else{
      //   toast.success("Not Correct ")
      // }
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
