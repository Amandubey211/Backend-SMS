import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  setAcademicYear,
  resetState as resetAuthState,
  setToken,
  setRole,
} from "../reducers/authSlice"; // Updated to handle token
import { setUserDetails, resetUserState } from "../../User/reducers/userSlice"; // For managing user details and resetting state
import { baseUrl } from "../../../../../config/Common";
import { requestPermissionAndGetToken } from "../../../../../Hooks/NotificationHooks/NotificationHooks";
import toast from "react-hot-toast";
import { formatAcademicYear } from "../utils/authUtils";

// **Staff login action**
export const staffLogin = createAsyncThunk(
  "auth/staffLogin",
  async (staffDetails, { rejectWithValue, dispatch }) => {
    try {
      const deviceToken = await requestPermissionAndGetToken(); // Get notification token
      const userDetail = { ...staffDetails, deviceToken }; // Include device token

      const { data } = await axios.post(
        `${baseUrl}/auth/staff/login`,
        userDetail
      );

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem(`${data.role}:token`, `Bearer ${data.token}`);
        localStorage.removeItem(process.env.REACT_APP_PARENT_TOKEN_STORAGE_KEY);
        localStorage.removeItem(
          process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY
        );
        console.log(data, "ddddddddddddd");

        // Dispatch user details to userSlice
        dispatch(
          setUserDetails({
            schoolId: data?.schoolId,
            userId: data?.userId,
            profile: data?.profile,
            fullName: data?.fullName,
            email: data?.email,
            mobileNumber: data?.mobileNumber,
            position: data?.position,
            employeeID: data?.employeeID,
            role: data?.role,
            monthlySalary: data?.monthlySalary,
            active: data?.active,
            dateOfBirth: data?.dateOfBirth,
          })
        );

        // Dispatch token and role to authSlice
        dispatch(setToken(data?.token));
        dispatch(setRole(data?.role));
        console.log("i ran");

        // Handle academic year
        if (data.role === "admin" && data.isAcademicYearActive === false) {
          toast.success("Please create an academic year");
          localStorage.setItem(
            "isAcademicYearActive",
            data.isAcademicYearActive
          );
          return { redirect: "/create_academicYear" }; // Return the redirect path
        } else {
          // Format and set the academic year in the state
          const formattedAcademicYear = formatAcademicYear(
            data.academicYear.year,
            data.academicYear.startDate,
            data.academicYear.endDate
          );
          dispatch(
            setAcademicYear([
              {
                ...formattedAcademicYear,
                isActive: data.isAcademicYearActive,
              },
            ])
          );
          return { redirect: "/dashboard" }; // Return the redirect path
        }
      } else {
        return rejectWithValue(data.message || "Login failed.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// **Staff logout action**
export const staffLogout = createAsyncThunk(
  "auth/staffLogout",
  async (_, { dispatch }) => {
    try {
      // Clear local storage and reset Redux states
      localStorage.clear(); // Clear local storage
      dispatch(resetAuthState()); // Reset auth state
      dispatch(resetUserState()); // Reset user state
      toast.success("Logged out successfully", {
        position: "bottom-left",
      });
      return true;
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      return false;
    }
  }
);

// **Create Academic Year action**
export const createAcademicYear = createAsyncThunk(
  "auth/createAcademicYear",
  async (yearData, { rejectWithValue, dispatch, getState }) => {
    try {
      const { common } = getState();
      const token = common.auth.token;
      // API call to create academic year
      const { data } = await axios.post(
        `${baseUrl}/admin/createAcademicYear`,
        yearData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success("Academic Year created successfully");

        localStorage.setItem("isAcademicYearActive", true); // Set Academic Year active in local storage

        // Dispatch the newly created academic year to the Redux store
        if (yearData.isActive) {
          dispatch(setAcademicYear([yearData]));
        }

        return true;
      } else {
        return rejectWithValue(
          data.message || "Failed to create Academic Year"
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
