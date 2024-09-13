import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resetState, setRole, setToken } from "../reducers/authSlice";
import { setUserDetails } from "../../User/reducers/userSlice";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";

// Student login action
export const studentLogin = createAsyncThunk(
  "auth/studentLogin",
  async (studentDetails, { rejectWithValue, dispatch }) => {
    try {
      const { email, password } = studentDetails;

      if (!email || !password) {
        toast.error("Please provide email and password.");
        return rejectWithValue("Validation failed.");
      }

      const { data } = await axios.post(
        `${baseUrl}/auth/student/login`,
        studentDetails
      );

      if (data.success) {
        const tokenKey = process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY;
        localStorage.setItem(tokenKey, `Bearer ${data.token}`);
        localStorage.setItem("classId", `${data.classId}`);

        dispatch(setToken(data.token)); // Store token in state
        dispatch(setRole(data.role)); // Set role
        dispatch(
          setUserDetails({
            schoolId: data.schoolId,
            userId: data.userId,
            profile: data.profile,
            fullName: data.fullName,
          })
        );

        if (data.isVerifiedSchoolId) {
          return { redirect: "/student_dash" };
        } else {
          return { redirect: "/verify_qid" };
        }
      } else {
        return rejectWithValue(data.msg || "Login failed.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Student logout action
export const studentLogout = createAsyncThunk(
  "auth/studentLogout",
  async (_, { dispatch }) => {
    localStorage.removeItem(process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY);

    dispatch(resetState()); // Reset auth state
    toast.success("Logged out successfully", {
      position: "bottom-left",
    });
    return true;
  }
);

// Student QID verification action
export const qidVerification = createAsyncThunk(
  "auth/qidVerification",
  async (studentDetails, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem(
        process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY
      );

      const { data } = await axios.post(
        `${baseUrl}/student/verify_school_id`,
        studentDetails,
        {
          headers: { Authorization: token },
        }
      );

      if (data.success) {
        dispatch(setRole("student"));
        return { role: "student" };
      } else {
        return rejectWithValue(data.msg || "Verification failed.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);
