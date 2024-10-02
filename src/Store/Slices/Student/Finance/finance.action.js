
import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../config/Common";
import axios from "axios";


// fetch student fees details
export const StudentFinanceDetails = createAsyncThunk(
  `fees/StudentFinanceDetails`,
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("student:token");
    if (!token) {
      return rejectWithValue(`Authentication failed!`);
    }
    try {
      const res = await axios.get(`${baseUrl}/student/my_fees`, {
        headers: { Authentication: token },
      });
      const data = res?.data;

      return data;
    } catch (error) {
      console.log("Error in StudentFinanceDetails:", error);
      // Return a detailed error message with `rejectWithValue` for better control
      return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
    }
  }
)

