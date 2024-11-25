// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import {
//   setAcademicYear,
//   resetState as resetAuthState,
//   setToken,
//   setRole,
// } from "../reducers/authSlice"; // Updated to handle token
// import { setUserDetails, resetUserState } from "../../User/reducers/userSlice"; // For managing user details and resetting state
// import { baseUrl } from "../../../../../config/Common";
// import { requestPermissionAndGetToken } from "../../../../../Hooks/NotificationHooks/NotificationHooks";
// import toast from "react-hot-toast";
// import { formatAcademicYear } from "../utils/authUtils";
// import { fetchAcademicYear } from "../../AcademicYear/academicYear.action";
// import { setSeletedAcademicYear } from "../../AcademicYear/academicYear.slice";

// // **Staff login action**
// export const staffLogin = createAsyncThunk(
//   "auth/staffLogin",
//   async (staffDetails, { rejectWithValue, dispatch, getState }) => {
//     try {
//       const deviceToken = await requestPermissionAndGetToken(); // Get notification token
//       const userDetail = { ...staffDetails, deviceToken }; // Include device token

//       const { data } = await axios.post(
//         `${baseUrl}/auth/staff/login`,
//         userDetail
//       );

//       if (data.success) {
//         // Store token in localStorage
//         localStorage.setItem(`${data.role}:token`, `Bearer ${data.token}`);
//         // localStorage.removeItem(process.env.REACT_APP_PARENT_TOKEN_STORAGE_KEY);
//         // localStorage.removeItem(
//         //   process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY
//         // );

//         // Dispatch user details to userSlice
//         dispatch(
//           setUserDetails({
//             schoolId: data?.schoolId,
//             userId: data?.userId,
//             profile: data?.profile,
//             fullName: data?.fullName,
//             email: data?.email,
//             mobileNumber: data?.mobileNumber,
//             position: data?.position,
//             employeeID: data?.employeeID,
//             role: data?.role,
//             monthlySalary: data?.monthlySalary,
//             active: data?.active,
//             dateOfBirth: data?.dateOfBirth,
//             schoolName: data?.schoolName,
//           })
//         );

//         // Dispatch token and role to authSlice
//         dispatch(setToken(data?.token));
//         dispatch(setRole(data?.role));

//         // Handle academic year
//         if (data.role === "admin" && data.isAcademicYearActive === false) {
//           toast.success("Please create an academic year");
//           localStorage.setItem(
//             "isAcademicYearActive",
//             data.isAcademicYearActive
//           );
//           return { redirect: "/create_academicYear" }; // Return the redirect path
//         } else {
//           // Format and set the academic year in the state
//           const formattedAcademicYear = formatAcademicYear(
//             data.academicYear.year,
//             data.academicYear.startDate,
//             data.academicYear.endDate
//           );
//           dispatch(
//             setAcademicYear([
//               {
//                 ...formattedAcademicYear,
//                 isActive: data.isAcademicYearActive,
//               },
//             ])
//           );
//           await dispatch(fetchAcademicYear());
//           const activeAcademicYear =
//             await getState().common?.academicYear?.academicYears?.find(
//               (i) => i.isActive == true
//             );
//           localStorage.setItem("say", activeAcademicYear?._id);
//           dispatch(setToken(data.token));
//           dispatch(setRole(data.role));

//           return { redirect: "/dashboard" }; // Return the redirect path
//         }
//       } else {
//         return rejectWithValue(data.message || "Login failed.");
//       }
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.msg || "Something went wrong. Please try again.";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// // **Staff logout action**
// export const staffLogout = createAsyncThunk(
//   "auth/staffLogout",
//   async (_, { dispatch }) => {
//     try {
//       // Clear local storage and reset Redux states
//       localStorage.clear(); // Clear local storage
//       dispatch(resetAuthState()); // Reset auth state
//       dispatch(resetUserState()); // Reset user state
//       toast.success("Logged out successfully", {
//         position: "bottom-left",
//       });
//       return true;
//     } catch (error) {
//       toast.error("Logout failed. Please try again.");
//       return false;
//     }
//   }
// );

// // **Create Academic Year action**
// export const createAcademicYear = createAsyncThunk(
//   "auth/createAcademicYear",
//   async (yearData, { rejectWithValue, dispatch, getState }) => {
//     try {
//       const { common } = getState();
//       const token = common.auth.token;
//       // API call to create academic year
//       const { data } = await axios.post(
//         `${baseUrl}/admin/createAcademicYear`,
//         yearData,
//         {
//           headers: { Authentication: `Bearer ${token}` },
//         }
//       );

//       if (data.success) {
//         toast.success("Academic Year created successfully");

//         localStorage.setItem("isAcademicYearActive", true); // Set Academic Year active in local storage

//         // Dispatch the newly created academic year to the Redux store
//         if (yearData.isActive) {
//           dispatch(setSeletedAcademicYear(data.data));
//           localStorage.setItem("say", data?.data?._id);
//         }

//         return true;
//       } else {
//         return rejectWithValue(
//           data.message || "Failed to create Academic Year"
//         );
//       }
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         "Something went wrong. Please try again.";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );
// thunks/authThunks.js

// ----------------------------------------// Api Services Integrated // ------------------

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setAcademicYear,
  resetState as resetAuthState,
  setToken,
  setRole,
} from "../reducers/authSlice"; // Updated to handle token
import { setUserDetails, resetUserState } from "../../User/reducers/userSlice"; // For managing user details and resetting state
import { requestPermissionAndGetToken } from "../../../../../Hooks/NotificationHooks/NotificationHooks";
import toast from "react-hot-toast";
import { formatAcademicYear } from "../utils/authUtils";
import { fetchAcademicYear } from "../../AcademicYear/academicYear.action";
import { setSeletedAcademicYear } from "../../AcademicYear/academicYear.slice";
import Cookies from 'js-cookie';
import { setErrorMsg, setShowError } from "../../Alerts/alertsSlice";
import { ErrorMsg } from "../../Alerts/errorhandling.action";
import { postData } from "../../../../../services/apiEndpoints";


// **Staff Login Action**
export const staffLogin = createAsyncThunk(
  "auth/staffLogin",
  async (staffDetails, { rejectWithValue, dispatch, getState }) => {
    try {
      // Mandatory lines
      dispatch(setShowError(false));

      const deviceToken = await requestPermissionAndGetToken(); // Get notification token
      const userDetail = { ...staffDetails, deviceToken }; // Include device token

      const data = await postData("/auth/staff/login", userDetail);
      console.log(data);

      if (data && data.success) {
        // Store token in localStorage
        //localStorage.setItem(`${data.role}:token`, `Bearer ${data.token}`);
        Cookies.set(`userToken`, `${data.token}`, {
          httpOnly: true,
          expires: 1, // Token will expire in 1 hour
          secure: false,
          //secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
          sameSite: 'Strict', // Prevent CSRF attacks
          path: '/', // Make cookie accessible across the entire app
        });
        // localStorage.removeItem(process.env.REACT_APP_PARENT_TOKEN_STORAGE_KEY);
        // localStorage.removeItem(
        //   process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY
        // );


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

        // Dispatch token and role to authSlice
        dispatch(setToken(data.token));
        dispatch(setRole(data.role));

        // Handle academic year
        if (data.role === "admin" && !data.isAcademicYearActive) {
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
          await dispatch(fetchAcademicYear());
          const activeAcademicYear =
            getState().common?.academicYear?.academicYears?.find(
              (i) => i.isActive === true
            );
          if (activeAcademicYear) {
            localStorage.setItem("say", activeAcademicYear._id);
          }

          // Token and role already set above, no need to set again
          return { redirect: "/dashboard" }; // Return the redirect path
        }
      } else {
        const errorMessage = data?.msg || "Incorrect email or password.";
        // dispatch(setShowError(true));
        // dispatch(setErrorMsg(errorMessage));
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      console.error("Error in staff login:", error);
      const err = ErrorMsg(error);
      // dispatch(setShowError(true));
      // dispatch(setErrorMsg(err.message));
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

        localStorage.setItem("isAcademicYearActive", true); // Set Academic Year active in local storage

        // Dispatch the newly created academic year to the Redux store
        if (yearData.isActive) {
          dispatch(setSeletedAcademicYear(data.data));
          localStorage.setItem('say', data?.data?._id);
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
