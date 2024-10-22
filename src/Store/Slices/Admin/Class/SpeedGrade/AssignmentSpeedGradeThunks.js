import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common"; // Importing baseUrl

export const fetchAssignedAssignmentStudents = createAsyncThunk(
  "speedGrade/fetchAssignedAssignmentStudents",
  async (assignmentId, { getState, rejectWithValue }) => {
    const { common } = getState();
    const token = common.auth.token;
    try {
      const response = await axios.get(
        `${baseUrl}/admin/speed_grade/students/${assignmentId}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch students"
      );
    }
  }
);

export const fetchStudentAssignment = createAsyncThunk(
  "speedGrade/fetchStudentAssignment",
  async ({ studentId, assignmentId }, { getState, rejectWithValue }) => {
    const { common } = getState();
    const token = common.auth.token;
    try {
      const response = await axios.get(
        `${baseUrl}/admin/speed_grade/assignment`,
        {
          headers: { Authentication: `Bearer ${token}` },
          params: { studentId, assignmentId },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch assignment details"
      );
    }
  }
);

export const assignAssignmentGrade = createAsyncThunk(
  "speedGrade/assignAssignmentGrade",
  async (
    { studentId, assignmentId, grade, attemptDate, status },
    { getState, rejectWithValue }
  ) => {
    const { common } = getState();
    const token = common.auth.token;
    try {
      const response = await axios.put(
        `${baseUrl}/admin/speed_grade/grade`,
        { studentId, assignmentId, grade, attemptDate, status },
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to assign grade"
      );
    }
  }
);
