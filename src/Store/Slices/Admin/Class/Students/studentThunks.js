import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";

// Fetch students by class and section
export const fetchStudentsByClassAndSection = createAsyncThunk(
  "students/fetchByClassAndSection",
  async (classId, { getState, rejectWithValue }) => {
    const token = getState().common.auth.token;

    try {
      const response = await axios.get(`${baseUrl}/admin/student/${classId}`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch students";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch all students
export const fetchAllStudents = createAsyncThunk(
  "students/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().common.auth.token;

    try {
      const response = await axios.get(`${baseUrl}/admin/all/students`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch all students";
      return rejectWithValue(errorMessage);
    }
  }
);

// Promote Students
export const promoteStudents = createAsyncThunk(
  "students/promoteStudents",
  async (
    { studentIds, promotionClassId, academicYearId },
    { getState, rejectWithValue }
  ) => {
    const token = getState().common.auth.token;

    try {
      const response = await axios.put(
        `${baseUrl}/admin/promote/students`,
        { studentIds, promotionClassId, academicYearId },
        { headers: { Authentication: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to promote students";
      return rejectWithValue(errorMessage);
    }
  }
);

// Promote Students in Same Class
export const promoteInSameClassStudents = createAsyncThunk(
  "students/promoteInSameClass",
  async ({ studentIds, academicYearId }, { getState, rejectWithValue }) => {
    const token = getState().common.auth.token;

    try {
      const response = await axios.put(
        `${baseUrl}/admin/promote/inSameClass/students`,
        { studentIds, academicYearId },
        { headers: { Authentication: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to promote students in the same class";
      return rejectWithValue(errorMessage);
    }
  }
);

// Graduate Students
export const graduateStudents = createAsyncThunk(
  "students/graduateStudents",
  async ({ studentIds }, { getState, rejectWithValue }) => {
    const token = getState().common.auth.token;

    try {
      const response = await axios.put(
        `${baseUrl}/admin/graduate/students`,
        { studentIds },
        { headers: { Authentication: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to graduate students";
      return rejectWithValue(errorMessage);
    }
  }
);

// Demote Students
export const demoteStudents = createAsyncThunk(
  "students/demoteStudents",
  async ({ studentIds }, { getState, rejectWithValue }) => {
    const token = getState().common.auth.token;

    try {
      const response = await axios.put(
        `${baseUrl}/admin/demote/students`,
        { studentIds },
        { headers: { Authentication: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to demote students";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Graduates
export const fetchGraduates = createAsyncThunk(
  "students/fetchGraduates",
  async (queryParams, { getState, rejectWithValue }) => {
    const token = getState().common.auth.token;
    try {
      const response = await axios.get(`${baseUrl}/admin/graduates/students`, {
        headers: { Authentication: `Bearer ${token}` },
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch graduates";
      return rejectWithValue(errorMessage);
    }
  }
);
