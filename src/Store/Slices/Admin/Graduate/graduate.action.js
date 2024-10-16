import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from '../../../../config/Common';

export const fetchGraduates = createAsyncThunk(
  "graduates/fetchGraduates",
  async ({ batchStart, batchEnd, email, Q_Id, admissionNumber, page, limit }, { rejectWithValue, getState }) => {
    const { role } = getState().common.auth;
    const token = localStorage.getItem(`${role}:token`);

    if (!token) {
      return rejectWithValue("Authentication failed!");
    }

    try {
      const response = await axios.get(`${baseUrl}/admin/graduates/students`, {
        headers: {
          Authentication: token,
        },
        params: { batchStart, batchEnd, email, Q_Id, admissionNumber, page, limit },
      });

      return {
        data: response.data.data,
        total: response.data.total,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
