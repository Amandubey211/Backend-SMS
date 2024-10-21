import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import { fetchClassDetails } from "../actions/classThunk";
import { setSubjects } from "./subjectSlice";

// Fetch subjects by classId
export const fetchSubjects = createAsyncThunk(
  "subject/fetchSubjects",
  async (classId, { rejectWithValue, getState, dispatch }) => {
    const { common } = getState(); // Accessing the auth token from the common slice
    const token = common.auth.token;

    try {
      const response = await axios.get(`${baseUrl}/admin/subject/${classId}`, {
        headers: { Authentication: `Bearer ${token}` },
      });

      const { data } = response.data;
      dispatch(setSubjects(data)); // Update the subjects state using the setSubjects action
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "No Subject Found ";
      return rejectWithValue(errorMessage);
    }
  }
);

// Create a new subject
export const createSubject = createAsyncThunk(
  "subject/createSubject",
  async (subjectData, { rejectWithValue, getState, dispatch }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.post(
        `${baseUrl}/admin/subject`,
        subjectData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      console.log(subjectData, "aaaaaaaa");

      dispatch(fetchClassDetails(subjectData.classId));
      return response.data.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Failed to create subject";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update an existing subject
export const updateSubject = createAsyncThunk(
  "subject/updateSubject",
  async (
    { subjectId, subjectData },
    { rejectWithValue, getState, dispatch }
  ) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.put(
        `${baseUrl}/admin/subject/${subjectId}`,
        subjectData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );

      dispatch(fetchClassDetails(subjectData.classId));
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Failed to update subject";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete a subject
export const deleteSubject = createAsyncThunk(
  "subject/deleteSubject",
  async ({ subjectId, classId }, { rejectWithValue, getState, dispatch }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      await axios.delete(`${baseUrl}/admin/subject/${subjectId}`, {
        headers: { Authentication: `Bearer ${token}` },
      });

      dispatch(fetchClassDetails(classId));
      return subjectId;
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Failed to delete subject";
      return rejectWithValue(errorMessage);
    }
  }
);
