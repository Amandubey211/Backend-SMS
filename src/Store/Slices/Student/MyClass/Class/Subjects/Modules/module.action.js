import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";

export const stdModule = createAsyncThunk(
  "module/stdModule",
  async ({ cid, sid }, { rejectWithValue }) => {
    const token = localStorage.getItem("student:token");
    if (!token) {
      return rejectWithValue("Authentication failed!");
    }

    try {
      const res = await axios.get(
        `${baseUrl}/admin/student/classes/${cid}/modules/${sid}`,
        {
          headers: {
            Authentication: token,
          },
        }
      );
      const data = res?.data?.data;
      console.log("std module action--->", data);
      return data;
    } catch (error) {
      console.log("Error in student Module", error);
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Something Went Wrong!"
      );
    }
  }
);
