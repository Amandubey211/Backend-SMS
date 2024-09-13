import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";

// Fetch user data
export const fetchUserData = createAsyncThunk(
  "User/fetchUserData",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  }
);

// Fetch class data
export const fetchClassData = createAsyncThunk(
  "User/fetchClassData",
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/class/${classId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch class data"
      );
    }
  }
);

// Fetch subject data
export const fetchSubjectData = createAsyncThunk(
  "User/fetchSubjectData",
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/subject/${subjectId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subject data"
      );
    }
  }
);
