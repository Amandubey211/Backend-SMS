
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

export const fetchAllParent = createAsyncThunk(
  "user/allParent",
  async (_, { rejectWithValue, getState }) => {
    const { common } = getState();
    const token = common.auth.token;
    try {
      const response = await axios.get(`${baseUrl}/admin/all/Parents`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
     
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);