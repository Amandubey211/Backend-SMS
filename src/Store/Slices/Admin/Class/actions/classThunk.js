import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import { setClass } from "../reducer/classSlice";
import { setSubjects } from "../Subject/subjectSlice";
import toast from "react-hot-toast";

// Fetch all classes
export const fetchAllClasses = createAsyncThunk(
  "class/fetchAllClasses",
  async (_, { getState, rejectWithValue }) => {
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
export const fetchClassDetails = createAsyncThunk(
  "class/fetchClassDetails",
  async (classId, { rejectWithValue, getState, dispatch }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.get(
        `${baseUrl}/admin/class/${classId}`,

        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );

      console.log(response.data);
      // Dispatch the class and subjects to the Redux store
      dispatch(setClass(response.data?.data));
      dispatch(setSubjects(response.data?.data?.subjects));

      return response.data?.data; // Return the class details
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch class details";
      console.error("Error fetching class details:", errorMessage);
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


      toast.success("Class Created Sussessfully!")
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

      // After the update, refetch all classes to get the latest data
      dispatch(fetchAllClasses());

      return response.data; // Return success message
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Failed to update class";
      console.error("Error updating class:", errorMessage);
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

      return classId; // Return deleted class ID
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Failed to delete class";
      console.error("Error deleting class:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
