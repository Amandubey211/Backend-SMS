import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resetState } from "../reducers/authSlice";
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

        dispatch(
          setUserDetails({
            userId: data?.userId,
            profile: data?.profile,
            fullName: data?.fullName,
          })
        );
        return { role: data.role, token: data.token };
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
