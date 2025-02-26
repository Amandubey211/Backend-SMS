import { createAsyncThunk } from "@reduxjs/toolkit";
import { resetState, setRole, setToken } from "../reducers/authSlice";
import { setUserDetails } from "../../User/reducers/userSlice";
import toast from "react-hot-toast";
import { fetchAcademicYear } from "../../AcademicYear/academicYear.action";
import { handleError } from "../../Alerts/errorhandling.action";
import { postData } from "../../../../../services/apiEndpoints";
import Cookies from "js-cookie";
import { setLocalCookies } from "../../../../../Utils/academivYear";
// **Parent login action**
export const parentLogin = createAsyncThunk(
  "auth/parentLogin",
  async (
    { parentDetails, navigate },
    { rejectWithValue, dispatch, getState }
  ) => {
    // console.log("ddddd-========--------",getState())
    try {
      const data = await postData(`/auth/parent/login`, parentDetails);
      if (!data?.success) {
        const errorMessage =
          data?.msg || "Something went wrong. Please try again later.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
      if (data.success) {
        // localStorage.setItem("userData", JSON.stringify(data));
        await dispatch(fetchAcademicYear());
        const activeAcademicYear =
          await getState().common?.academicYear?.academicYears?.find(
            (i) => i.isActive == true
          );
        setLocalCookies("say", activeAcademicYear?._id);
        //   dispatch(setToken(data.token)); // Store token in state
        dispatch(setRole(data.role)); // Set role

        dispatch(
          setUserDetails({
            userId: data?.userId,
            profile: data?.profile,
            fullName: data?.fullName,
            email: data?.email,
            motherName: data?.motherName,
            guardianName: data?.guardianName,
            schoolName: data?.schoolName,
          })
        );
        navigate("/parent_dash");
        return data.token;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// **Parent logout action**
export const parentLogout = createAsyncThunk(
  "auth/parentLogout",
  async (_, { dispatch }) => {
    localStorage.clear();
    Cookies.remove("userToken");
    Cookies.remove("say");
    Cookies.remove("isAcademicYearActive");
    Cookies.remove("schoolId");
    Cookies.remove("SelectedschoolId");
    dispatch(resetState());
    return true;
  }
);
