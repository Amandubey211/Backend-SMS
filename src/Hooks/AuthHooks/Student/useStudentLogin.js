import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  setAuth,
  setRole,
  setUserDetails,
} from "../../../Redux/Slices/Auth/AuthSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setStudentId } from "../../../Redux/Slices/Common/CommonSlice";
import { baseUrl } from "../../../config/Common";

// Ensure this is correctly set in your .env file
const TOKEN_STORAGE_KEY = process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY; // Ensure this is correctly set in your .env file

const useStudentLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const studentLogin = async (studentDetails) => {
    setLoading(true);
    const { email, password } = studentDetails;
    console.log("Attempting login with:", studentDetails);

    if (!email || !password) {
      toast.error("Please provide email and password.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${baseUrl}/auth/student/login`,
        studentDetails
      );
      console.log("Login response:", data);
      console.log("USER id:", data.userId);

      if (data.success) {
        localStorage.setItem(TOKEN_STORAGE_KEY, `Bearer ${data.token}`);
        localStorage.setItem("classId", `${data.classId}`);
        console.log("Token stored in localStorage", data.token);

        dispatch(setAuth(true));
        dispatch(setStudentId(data.userId));
        dispatch(setRole(data.role));
        const user = {
          schoolId: data?.schoolId,
          userId: data?.userId,
          profile: data?.profile,
          fullName: data?.fullName,
        };
        dispatch(setUserDetails(user));
        // dispatch(setUerDetails(data.user));
        console.log("data", data);
        if (data.isVerifiedSchoolId) {
          navigate("/student_dash");
        } else {
          navigate("/verify_qid");
        }

        toast.success("Logged in successfully");
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
