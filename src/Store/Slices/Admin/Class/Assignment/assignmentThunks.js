import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

// Helper function to get the token from state
const getToken = (getState) => getState().common.auth.token;

// Thunk for creating an assignment
export const createAssignmentThunk = createAsyncThunk(
  "assignment/createAssignment",
  async (assignmentData, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState); // Get token using helper
      const response = await axios.post(
        `${baseUrl}/admin/create_assignment`,
        assignmentData,
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Assignment created successfully!");
        return response.data.assignment; // Return the created assignment
      } else {
        throw new Error(response.data.message || "Failed to create assignment");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create assignment"
      );
    }
  }
);

// Thunk for updating an assignment
export const updateAssignmentThunk = createAsyncThunk(
  "assignment/updateAssignment",
  async (
    { assignmentId, assignmentData, sectionId },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const token = getToken(getState); // Get token using helper
      const response = await axios.put(
        `${baseUrl}/admin/update_assignment/${assignmentId}`,
        {
          ...assignmentData,
          sectionId,
        },
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Assignment updated successfully!");
        dispatch(fetchAssignmentByIdThunk(assignmentId));
        return response.data.assignment; // Return the updated assignment
      } else {
        throw new Error(response.data.message || "Failed to update assignment");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update assignment"
      );
    }
  }
);

// Thunk for deleting an assignment
export const deleteAssignmentThunk = createAsyncThunk(
  "assignment/deleteAssignment",
  async (assignmentId, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState); // Get token using helper
      const response = await axios.delete(
        `${baseUrl}/admin/delete_assignment/${assignmentId}`,
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Assignment deleted successfully!");
        return assignmentId; // Return the deleted assignment ID to filter it out from state
      } else {
        throw new Error(response.data.message || "Failed to delete assignment");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete assignment"
      );
    }
  }
);

// Thunk for fetching assignments by class
export const fetchAssignmentsByClassThunk = createAsyncThunk(
  "assignment/fetchAssignmentsByClass",
  async (classId, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.get(
        `${baseUrl}/admin/class_assignments/${classId}`,
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        return response.data.assignments; // Return the assignments list
      } else {
        throw new Error(
          response.data.message || "Failed to fetch assignments by class"
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assignments by class"
      );
    }
  }
);
// Thunk to fetch filtered assignments
export const fetchFilteredAssignments = createAsyncThunk(
  "assignments/fetchFiltered",
  async (
    { sid, moduleId, chapterId, publish },
    { getState, rejectWithValue }
  ) => {
    try {
      const params = {};
      const token = getState().common.auth.token;

      if (moduleId) params.moduleId = moduleId;
      if (chapterId) params.chapterId = chapterId;
      if (publish !== null) params.publish = publish;

      const response = await axios.get(`${baseUrl}/admin/assignments/${sid}`, {
        params,
        headers: {
          Authentication: `Bearer ${token}`,
        },
      });

      return response.data.assignments;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch assignments."
      );
    }
  }
);

// Thunk to fetch assignment by ID
export const fetchAssignmentByIdThunk = createAsyncThunk(
  "assignment/fetchAssignmentById",
  async (assignmentId, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.get(
        `${baseUrl}/admin/assignment/${assignmentId}`,
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data, "ddddddddddddd");
      if (response.data.success) {
        return response.data.assignment; // Return the fetched assignment data
      } else {
        throw new Error(response.data.message || "Failed to fetch assignment");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assignment"
      );
    }
  }
);
