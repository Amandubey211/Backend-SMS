import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import { setStudents, setAllStudents } from "./studentSlice";
import toast from "react-hot-toast";

// Fetch students by class and section
export const fetchStudentsByClassAndSection = createAsyncThunk(
  "students/fetchByClassAndSection",
  async (classId, { getState, rejectWithValue }) => {
    const role = getState().auth.role; // Assuming you have a separate slice for auth
    const token =
      getState().common.auth.token || localStorage.getItem(`${role}:token`);

    try {
      const response = await axios.get(`${baseUrl}/admin/student/${classId}`, {
        headers: { Authentication: token },
      });
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch students";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch all students
export const fetchAllStudents = createAsyncThunk(
  "students/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    const role = getState().auth.role;
    const token =
      getState().common.auth.token || localStorage.getItem(`${role}:token`);

    try {
      const response = await axios.get(`${baseUrl}/admin/all/students`, {
        headers: { Authentication: token },
      });
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch all students";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
