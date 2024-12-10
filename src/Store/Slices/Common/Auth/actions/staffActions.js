// ----------------------------------------// Api Services Integrated // ------------------

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setAcademicYear,
  resetState as resetAuthState,
  setToken,
  setRole,
  setUserRoles,
} from "../reducers/authSlice"; // Updated to handle token
import { setUserDetails, resetUserState } from "../../User/reducers/userSlice"; // For managing user details and resetting state
import { requestPermissionAndGetToken } from "../../../../../Hooks/NotificationHooks/NotificationHooks";
import toast from "react-hot-toast";
import { formatAcademicYear } from "../utils/authUtils";
import { fetchAcademicYear } from "../../AcademicYear/academicYear.action";
import { setSeletedAcademicYear } from "../../AcademicYear/academicYear.slice";
import Cookies from "js-cookie";
import { setErrorMsg, setShowError } from "../../Alerts/alertsSlice";
import { ErrorMsg } from "../../Alerts/errorhandling.action";
import { postData } from "../../../../../services/apiEndpoints";
import { setLocalCookies } from "../../../../../Utils/academivYear";

// **Staff Login Action**
export const staffLogin = createAsyncThunk(
  "auth/staffLogin",
  async (staffDetails, { rejectWithValue, dispatch, getState }) => {
    try {
      // Hide any previous errors
      dispatch(setShowError(false));

      // Get device token for notifications
      const deviceToken = await requestPermissionAndGetToken();
      const userDetail = { ...staffDetails, deviceToken };

      // Send login request
      const data = await postData("/auth/staff/login", userDetail);

      if (data && data.success) {
        // Dispatch user details to userSlice
        dispatch(
          setUserDetails({
            schoolId: data.schoolId,
            userId: data.userId,
            profile: data.profile,
            fullName: data.fullName,
            email: data.email,
            mobileNumber: data.mobileNumber,
            position: data.position,
            employeeID: data.employeeID,
            role: data.role,
            monthlySalary: data.monthlySalary,
            active: data.active,
            dateOfBirth: data.dateOfBirth,
            schoolName: data.schoolName,
          })
        );

        // Dispatch role to authSlice
        dispatch(setRole(data.role));

        // Store grouped roles in the state
        if (data.groupedRoles && data.groupedRoles.length > 0) {
          dispatch(setUserRoles(data.groupedRoles));
        }

        // Handle admin role redirection
        if (data.role === "admin") {
          if (!data.isAcademicYearActive) {
            toast.success("Please create an academic year");
            setLocalCookies("isAcademicYearActive", data.isAcademicYearActive);
            return { redirect: "/create_academicYear" };
          }
          return { redirect: "/select_branch" };
        }

        // Handle staff roles with grouped roles
        if (data.groupedRoles && data.groupedRoles.length > 0) {
          return { redirect: "/select_role" };
        }

        // For non-admin users without grouped roles, set academic year and redirect to dashboard
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

        // Fetch academic year details
        await dispatch(fetchAcademicYear());
        const activeAcademicYear =
          getState().common?.academicYear?.academicYears?.find(
            (i) => i.isActive === true
          );
        if (activeAcademicYear) {
          setLocalCookies("say", activeAcademicYear._id);
        }

        return { redirect: "/dashboard" };
      } else {
        const errorMessage = data?.msg || "Incorrect email or password.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      console.error("Error in staff login:", error);
      const err = ErrorMsg(error);
      toast.error(err.message || "Login failed.");
      return rejectWithValue(err.message || "Login failed.");
    }
  }
);
// Staff Logout
export const staffLogout = createAsyncThunk(
  "auth/staffLogout",
  async (_, { dispatch }) => {
    try {
      Cookies.remove("userToken");
      Cookies.remove("say");
      Cookies.remove("isAcademicYearActive");
      Cookies.remove("schoolId");
      Cookies.remove("SelectedschoolId");
      // Mandatory lines
      dispatch(setShowError(false));

      // Clear local storage and reset Redux states
      localStorage.clear(); // Clear local storage
      dispatch(resetAuthState()); // Reset auth state
      dispatch(resetUserState()); // Reset user state
      toast.success("Logged out successfully", {
        position: "bottom-left",
      });
      return true;
    } catch (error) {
      console.error("Error in staff logout:", error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Logout failed. Please try again."));
      toast.error("Logout failed. Please try again.");
      return false;
    }
  }
);

// **Create Academic Year Action**
export const createAcademicYear = createAsyncThunk(
  "auth/createAcademicYear",
  async (yearData, { rejectWithValue, dispatch, getState }) => {
    try {
      // Mandatory lines
      dispatch(setShowError(false));

      const data = await postData("/admin/createAcademicYear", yearData);

      if (data && data.success) {
        toast.success("Academic Year created successfully");

        setLocalCookies("isAcademicYearActive", true); // Set Academic Year active in local storage

        // Dispatch the newly created academic year to the Redux store
        if (yearData.isActive) {
          dispatch(setSeletedAcademicYear(data.data));
          setLocalCookies("say", data?.data?._id);
        }

        return true;
      } else {
        const errorMessage = data?.message || "Failed to create Academic Year";
        dispatch(setShowError(true));
        dispatch(setErrorMsg(errorMessage));
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      console.error("Error in creating Academic Year:", error);
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err.message));
      toast.error(err.message || "Failed to create Academic Year.");
      return rejectWithValue(err.message || "Failed to create Academic Year.");
    }
  }
);
