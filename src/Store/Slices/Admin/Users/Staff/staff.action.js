
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
export const fetchAllStaff = createAsyncThunk(
  "user/allStaff",
  async (_, { rejectWithValue, getState }) => {
    const { common } = getState();
    const token = common.auth.token;
    try {
      const response = await axios.get(`${baseUrl}/admin/get_staffs`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch staff.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);