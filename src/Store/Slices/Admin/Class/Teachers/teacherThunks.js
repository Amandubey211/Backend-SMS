import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import {
  setTeacherAssign,
  setTeachers,
  filterTeachersBySection,
} from "./teacherSlice";

// Fetch all teachers
export const fetchAllTeachers = createAsyncThunk(
  "teachers/fetchAllTeachers",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const token = getState().common.auth.token;

    try {
      const response = await axios.get(`${baseUrl}/admin/teacher`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      dispatch(setTeachers(response.data.data));
      dispatch(filterTeachersBySection()); // Filter after fetching teachers
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
// Fetch teachers by class
export const fetchTeachersByClass = createAsyncThunk(
  "teachers/fetchByClass",
  async (classId, { rejectWithValue, getState, dispatch }) => {
    const token = getState().common.auth.token;

    try {
      const { data } = await axios.get(`${baseUrl}/admin/teacherByClass`, {
        params: { id: classId },
        headers: { Authentication: `Bearer ${token}` },
      });
      console.log(data.data, "oooo");
      dispatch(setTeacherAssign(data.data));
      dispatch(filterTeachersBySection()); // Filter after fetching teachers
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
// Assign teacher to a class
export const assignTeacher = createAsyncThunk(
  "teacher/assignTeacher",
  async (assignData, { rejectWithValue, getState, dispatch }) => {
    const token = getState().common.auth.token;

    try {
      const response = await axios.post(
        `${baseUrl}/admin/teacher`,
        assignData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      dispatch(fetchTeachersByClass(assignData.classId));
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign teacher."
      );
    }
  }
);

// Unassign teacher from a class
export const unassignTeacher = createAsyncThunk(
  "teacher/unassignTeacher",
  async ({ teacherId, classId }, { rejectWithValue, getState, dispatch }) => {
    const token = getState().common.auth.token;

    try {
      await axios.delete(
        `${baseUrl}/admin/teacher/${teacherId}/class/${classId}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      dispatch(fetchTeachersByClass(classId));
      return teacherId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unassign teacher."
      );
    }
  }
);
