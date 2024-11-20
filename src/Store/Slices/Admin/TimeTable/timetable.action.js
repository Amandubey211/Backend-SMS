import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common"; // Replace with your actual base URL
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";

// Fetch Timetables
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

export const fetchTimetables = createAsyncThunk(
  "timetable/fetchTimetables",
  async (filters = {}, { rejectWithValue, getState, dispatch }) => {
    const { role } = getState().common.auth;
    const token = getToken(getState(), rejectWithValue, dispatch); // Fetch token from Redux state
    if (typeof token === "object") return token;

    const say = localStorage.getItem("say");
    let updatedFilters = { ...filters };

    // If role is student, include classId from localStorage
    if (role === "student" || role === "teacher") {
      const classId = localStorage.getItem("classId");
      if (classId) {
        updatedFilters = { ...updatedFilters, classId };
      }
    }

    try {
      const response = await axios.get(`${baseUrl}/admin/timetable?say=${say}`, {
        headers: { Authentication: token },
        params: updatedFilters,
      });

      // Ensure you're accessing the correct data property
      return response.data.data; // Accessing the nested data property
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);



// Create Timetable
export const createTimetable = createAsyncThunk(
  "timetable/createTimetable",
  async (data, { rejectWithValue, getState, dispatch }) => {
    const { role } = getState().common.auth;
    const token = getToken(getState(), rejectWithValue, dispatch); // Fetch token from Redux state
    if (typeof token === "object") return token;
    const say = localStorage.getItem("say")

    try {
      const response = await axios.post(`${baseUrl}/admin/create-timetable?say=${say}`, data, {
        headers: { Authentication: token },
      });
      return response.data; // Returning newly created timetable
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update Timetable
export const updateTimetable = createAsyncThunk(
  "timetable/updateTimetable",
  async ({ id, data }, { rejectWithValue, getState, dispatch }) => {
    const { role } = getState().common.auth;
    const token = getToken(getState(), rejectWithValue, dispatch); // Fetch token from Redux state
    if (typeof token === "object") return token;
    const say = localStorage.getItem("say")
    if (!token) {
      return rejectWithValue("Authentication failed!");
    }

    try {
      const response = await axios.put(`${baseUrl}/admin/update-timetable/${id}?say=${say}`, data, {
        headers: { Authentication: token },
      });
      return response.data; // Returning updated timetable
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete Timetable
export const deleteTimetable = createAsyncThunk(
  "timetable/deleteTimetable",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const token = getToken(getState(), rejectWithValue, dispatch); // Fetch token from Redux state
    if (typeof token === "object") return token;
    const say = localStorage.getItem("say")

    try {
      const response = await axios.delete(`${baseUrl}/admin/delete-timetable/${id}?say=${say}`, {
        headers: { Authentication: token },
      });
      return { id }; // Returning ID of the deleted timetable
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
