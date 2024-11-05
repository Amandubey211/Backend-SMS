import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common"; // Replace with your actual base URL

// Fetch Timetables
export const fetchTimetables = createAsyncThunk(
  "timetable/fetchTimetables",
  async (filters = {}, { rejectWithValue, getState }) => {
    const { role } = getState().common.auth;
    const token = localStorage.getItem(`${role}:token`);

    if (!token) {
      return rejectWithValue("Authentication failed!");
    }

    try {
      const response = await axios.get(`${baseUrl}/admin/timetable`, {
        headers: { Authentication: token },
        params: filters,
      });

      // Ensure you're accessing the correct data property
      return response.data.data; // Accessing the nested data property
    } catch (error) {
      console.error("Error fetching timetables:", error);
      return rejectWithValue(error.message);
    }
  }
);



// Create Timetable
export const createTimetable = createAsyncThunk(
  "timetable/createTimetable",
  async (data, { rejectWithValue, getState }) => {
    const { role } = getState().common.auth;
    const token = localStorage.getItem(`${role}:token`);
    const say = localStorage.getItem("say")
    if (!token) {
      return rejectWithValue("Authentication failed!");
    }

    try {
      const response = await axios.post(`${baseUrl}/admin/create-timetable`, data, {
        headers: { Authentication: token },
      });
      return response.data; // Returning newly created timetable
    } catch (error) {
      console.error("Error creating timetable:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Update Timetable
export const updateTimetable = createAsyncThunk(
  "timetable/updateTimetable",
  async ({ id, data }, { rejectWithValue, getState }) => {
    const { role } = getState().common.auth;
    const token = localStorage.getItem(`${role}:token`);
    const say = localStorage.getItem("say")
    if (!token) {
      return rejectWithValue("Authentication failed!");
    }

    try {
      const response = await axios.put(`${baseUrl}/admin/update-timetable/${id}`, data, {
        headers: { Authentication: token },
      });
      return response.data; // Returning updated timetable
    } catch (error) {
      console.error("Error updating timetable:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Delete Timetable
export const deleteTimetable = createAsyncThunk(
  "timetable/deleteTimetable",
  async (id, { rejectWithValue, getState }) => {
    const { role } = getState().common.auth;
    const token = localStorage.getItem(`${role}:token`);
    const say = localStorage.getItem("say")
    if (!token) {
      return rejectWithValue("Authentication failed!");
    }

    try {
      const response = await axios.delete(`${baseUrl}/admin/delete-timetable/${id}`, {
        headers: { Authentication: token },
      });
      return { id }; // Returning ID of the deleted timetable
    } catch (error) {
      console.error("Error deleting timetable:", error);
      return rejectWithValue(error.message);
    }
  }
);
