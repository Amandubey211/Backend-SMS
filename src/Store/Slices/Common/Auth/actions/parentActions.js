import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resetState, setRole, setToken } from "../reducers/authSlice";
import { baseUrl } from "../../../../../config/Common";
import { setUserDetails } from "../../User/reducers/userSlice";

// **Parent login action**
export const parentLogin = createAsyncThunk(
  "auth/parentLogin",
  async (parentDetails, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/auth/parent/login`,
        parentDetails
      );

      if (data.success) {
        const token = `Bearer ${data.token}`;
        localStorage.setItem("userData", JSON.stringify(data));
        localStorage.setItem(`${data.role}:token`, token);

        dispatch(setToken(data.token)); // Store token in state
        dispatch(setRole(data.role)); // Set role

        dispatch(
          setUserDetails({
            userId: data?.userId,
            profile: data?.profile,
            fullName: data?.fullName,
            email:data?.email,
            motherName:data?.motherName,
            guardianName:data?.guardianName,
          })
        );
        console.log("Parent Dashhhh :",data.token);
        


        return { redirect: "/parent_dash" };
      } else {
        return rejectWithValue(data.message || "Login failed.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// **Parent logout action**
export const parentLogout = createAsyncThunk(
  "auth/parentLogout",
  async (_, { dispatch }) => {
    localStorage.clear();
    dispatch(resetState());
    return true;
  }
);
