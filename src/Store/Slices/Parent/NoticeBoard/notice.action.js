import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import toast from "react-hot-toast";

// Async thunk to fetch all notices
export const fetchAllNotices = createAsyncThunk(
  "dashboard/fetchNotices",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("parent:token");

    if (!token) {
      toast.error("No token found");
      return rejectWithValue("No token found");
    }

    try {
      const response = await axios.get(`${baseUrl}/admin/all/notices`, {
        headers: {
          Authentication: `${token}`,
        },
      });
      console.log("API Response for Notices:", response.data.notices);
      return response.data.notices;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message ||"Failed to fetch notices";
      // toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);