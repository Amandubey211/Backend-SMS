// ----------------------------------------// Api Services Integrated // ------------------

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setAcademicYear,
  resetState as resetAuthState,
  setRole,
  setUserRoles,
} from "../reducers/authSlice"; // Updated to handle token
import { setUserDetails, resetUserState } from "../../User/reducers/userSlice"; // For managing user details and resetting state
import { requestPermissionAndGetToken } from "../../../../../Hooks/NotificationHooks/NotificationHooks";
import toast from "react-hot-toast";
import { formatAcademicYear } from "../utils/authUtils";
import { setSeletedAcademicYear } from "../../AcademicYear/academicYear.slice";
import Cookies from "js-cookie";
import { setErrorMsg, setShowError } from "../../Alerts/alertsSlice";
import { ErrorMsg } from "../../Alerts/errorhandling.action";
import { postData } from "../../../../../services/apiEndpoints";
import { setLocalCookies } from "../../../../../Utils/academivYear";
import { getMyRolePermissionsThunk } from "../../RBAC/rbacThunks";

// **Staff Login Action**
export const staffLogin = createAsyncThunk(
  "auth/staffLogin",
  async (staffDetails, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));

      // Get device token for notifications
      const deviceToken = await requestPermissionAndGetToken();
      const userDetail = { ...staffDetails, deviceToken };

      // Send login request
      const data = await postData("/auth/staff/login", userDetail);
      console.log(data, "Login response data");

      if (data?.success) {
        // Dispatch user details to the store
        dispatch(
          setUserDetails({
            schoolId: data.schoolId,
            userId: data.userId,
            profile: data.profile,
            fullName: data.fullName,
            email: data.email,
            mobileNumber: data.mobileNumber,
            position: data.position || "N/A",
            employeeID: data.employeeID || "N/A",
            role: data.role,
            monthlySalary: data.monthlySalary || 0,
            active: data.active ?? false,
            dateOfBirth: data?.dateOfBirth || "N/A",
            schoolName: data?.schoolName,
          })
        );
        dispatch(setRole(data.role));

        // Process academic year data if available
        if (data.academicYear) {
          const formattedAcademicYear = formatAcademicYear(
            data.academicYear?.year,
            data.academicYear?.startDate,
            data.academicYear?.endDate
          );
          dispatch(
            setAcademicYear([
              {
                ...formattedAcademicYear,
                isActive: data.isAcademicYearActive,
              },
            ])
          );

          if (
            data.isAcademicYearActive === true ||
            data.isAcademicYearActive === "active"
          ) {
            setLocalCookies("say", data.academicYear._id);
            setLocalCookies("isAcademicYearActive", "true");
          } else {
            setLocalCookies("isAcademicYearActive", "false");
          }
        }

        // Updated Admin logic: always set the admin role
        if (data.role === "admin") {
          dispatch(setRole(data.role));
          const academicYearActive =
            data.isAcademicYearActive === true ||
            data.isAcademicYearActive === "active";
          if (!academicYearActive) {
            toast.success("Please create an academic year");
            // Redirect admin to create academic year if inactive
            return { redirect: "/create_academicYear" };
          }
          return { redirect: "/select_branch" };
        }

        // For staff with multiple roles, force role selection
        if (data.groupedRoles && data.groupedRoles.length > 1) {
          dispatch(setUserRoles(data.groupedRoles));
          dispatch(setRole(null)); // Clear any auto-assigned role
          return { redirect: "/select_role" };
        }

        // If exactly one grouped role exists, auto-set it and proceed
        if (data.groupedRoles && data.groupedRoles.length === 1) {
          const userRole = data.groupedRoles[0].department;
          dispatch(setRole(userRole));
          await dispatch(getMyRolePermissionsThunk());
          return { redirect: "/dashboard" };
        }

        // For non-admin users without grouped roles, fetch permissions and redirect
        if (data.role) {
          await dispatch(getMyRolePermissionsThunk());
        }
        return { redirect: "/dashboard" };
      } else {
        const errorMessage =
          data?.msg || "Something went wrong. Please try again later.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.msg || error.message || "Login failed.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

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
