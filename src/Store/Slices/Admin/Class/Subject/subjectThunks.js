import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import { fetchClassDetails } from "../actions/classThunk";
import { setSubjects } from "./subjectSlice";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import toast from "react-hot-toast";

const say = localStorage.getItem("say");

// Helper function to get the token from Redux state
const getToken = (state, rejectWithValue, dispatch) => {
  const token = state.common.auth?.token;
  if (!token) {
    dispatch(setShowError(true));
    dispatch(setErrorMsg("Authentication Failed"));
    return rejectWithValue("Authentication Failed");
  }
  return `Bearer ${token}`;
};

// Centralized error handling
const handleError = (error, dispatch, rejectWithValue) => {
  const err = ErrorMsg(error);
  dispatch(setShowError(true));
  dispatch(setErrorMsg(err.message));
  return rejectWithValue(err.message);
};

// Fetch subjects by classId
export const fetchSubjects = createAsyncThunk(
  "subject/fetchSubjects",
  async (classId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/subject/${classId}?say=${say}`, {
        headers: { Authentication: token },
      });
      const { data } = response.data;
      dispatch(setSubjects(data)); // Update the subjects state using the setSubjects action
      return data;
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

// Create a new subject
export const createSubject = createAsyncThunk(
  "subject/createSubject",
  async (subjectData, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.post(
        `${baseUrl}/admin/subject?say=${say}`,
        subjectData,
        {
          headers: { Authentication: token },
        }
      );
      toast.success("Subject created successfully");
      dispatch(fetchClassDetails(subjectData.classId));
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update an existing subject
export const updateSubject = createAsyncThunk(
  "subject/updateSubject",
  async ({ subjectId, subjectData }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.put(
        `${baseUrl}/admin/subject/${subjectId}?say=${say}`,
        subjectData,
        {
          headers: { Authentication: token },
        }
      );
      toast.success("Subject updated successfully");
      dispatch(fetchClassDetails(subjectData.classId));
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete a subject
export const deleteSubject = createAsyncThunk(
  "subject/deleteSubject",
  async ({ subjectId, classId }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      await axios.delete(`${baseUrl}/admin/subject/${subjectId}?say=${say}`, {
        headers: { Authentication: token },
      });
      dispatch(fetchClassDetails(classId));
      toast.success("Subject deleted successfully");
      return subjectId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
