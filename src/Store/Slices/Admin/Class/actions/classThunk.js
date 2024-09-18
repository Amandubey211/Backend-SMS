import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";

const CACHE_DURATION = 10 * 60 * 1000; // Cache duration set to 10 minutes

// Fetch all classes (with caching)
export const fetchAllClasses = createAsyncThunk(
  "class/fetchAllClasses",
  async (_, { getState, rejectWithValue }) => {
    const { class: classState } = getState().admin; // Access the class state
    const { lastFetched } = classState;

    // Check if data is stale or still valid based on cache duration
    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
      console.log("Using cached class data.");
      return classState.classes; // Return cached classes if data is fresh
    }

    // If data is stale or missing, make the API request
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.get(`${baseUrl}/admin/class`, {
        headers: { Authentication: `Bearer ${token}` }, // Using Authentication header
      });

      return response.data.data; // Assuming this is the structure of your API response
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch classes";
      console.error("Error fetching classes:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Create a new class
export const createClass = createAsyncThunk(
  "class/createClass",
  async (classData, { rejectWithValue, getState, dispatch }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.post(`${baseUrl}/admin/class`, classData, {
        headers: { Authentication: `Bearer ${token}` }, // Using Authentication header
      });

      // After successful creation, refetch the class list
      dispatch(fetchAllClasses());

      return response.data; // Return newly created class data
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Failed to create class";
      console.error("Error creating class:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Update an existing class
export const updateClass = createAsyncThunk(
  "class/updateClass",
  async ({ classData, classId }, { rejectWithValue, getState, dispatch }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.put(
        `${baseUrl}/admin/update_class/${classId}`,
        classData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );

      console.log('Updated class data:', response.data); // Log the updated data
      return { ...response.data, classId }; // Return updated class data with ID
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Failed to update class";
      return rejectWithValue(errorMessage);
    }
  }
);
// Delete a class
export const deleteClass = createAsyncThunk(
  "class/deleteClass",
  async (classId, { rejectWithValue, getState, dispatch }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.delete(
        `${baseUrl}/admin/delete_class/${classId}`,
        {
          headers: { Authentication: `Bearer ${token}` }, // Using Authentication header
        }
      );

      // After successful deletion, refetch the class list
      dispatch(fetchAllClasses());

      return response.data; // Return confirmation of deletion
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Failed to delete class";
      console.error("Error deleting class:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
