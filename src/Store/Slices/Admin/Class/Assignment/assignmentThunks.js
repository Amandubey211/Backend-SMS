import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";

const say = localStorage.getItem("say");

// Helper function to get the token from the Redux state
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

// Thunk for creating an assignment
export const createAssignmentThunk = createAsyncThunk(
  "assignment/createAssignment",
  async (assignmentData, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.post(
        `${baseUrl}/admin/create_assignment?say=${say}`,
        assignmentData,
        {
          headers: {
            Authentication: token,
          },
        }
      );
      if (response.data.success) {
        toast.success("Assignment created successfully!");
        return response.data.assignment;
      } else {
        throw new Error(response.data.message || "Failed to create assignment");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
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
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.put(
        `${baseUrl}/admin/update_assignment/${assignmentId}?say=${say}`,
        {
          ...assignmentData,
          sectionId,
        },
        {
          headers: {
            Authentication: token,
          },
        }
      );
      if (response.data.success) {
        toast.success("Assignment updated successfully!");
        dispatch(fetchAssignmentByIdThunk(assignmentId));
        return response.data.assignment;
      } else {
        throw new Error(response.data.message || "Failed to update assignment");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Thunk for deleting an assignment
export const deleteAssignmentThunk = createAsyncThunk(
  "assignment/deleteAssignment",
  async (assignmentId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.delete(
        `${baseUrl}/admin/delete_assignment/${assignmentId}?say=${say}`,
        {
          headers: {
            Authentication: token,
          },
        }
      );
      if (response.data.success) {
        toast.success("Assignment deleted successfully!");
        return assignmentId;
      } else {
        throw new Error(response.data.message || "Failed to delete assignment");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Thunk for fetching assignments by class
export const fetchAssignmentsByClassThunk = createAsyncThunk(
  "assignment/fetchAssignmentsByClass",
  async (classId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(
        `${baseUrl}/admin/class_assignments/${classId}?say=${say}`,
        {
          headers: {
            Authentication: token,
          },
        }
      );
      if (response.data.success) {
        return response.data.assignments;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch assignments by class"
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Thunk to fetch filtered assignments
export const fetchFilteredAssignments = createAsyncThunk(
  "assignments/fetchFiltered",
  async (
    { sid, moduleId, chapterId, publish },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const params = {};
      const token = getToken(getState(), rejectWithValue, dispatch);

      if (moduleId) params.moduleId = moduleId;
      if (chapterId) params.chapterId = chapterId;
      if (publish !== null) params.publish = publish;

      const response = await axios.get(`${baseUrl}/admin/assignments/${sid}?say=${say}`, {
        params,
        headers: {
          Authentication: token,
        },
      });

      return response.data.assignments;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Thunk to fetch assignment by ID
export const fetchAssignmentByIdThunk = createAsyncThunk(
  "assignment/fetchAssignmentById",
  async (assignmentId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(
        `${baseUrl}/admin/assignment/${assignmentId}?say=${say}`,
        {
          headers: {
            Authentication: token,
          },
        }
      );
      if (response.data.success) {
        return response.data.assignment;
      } else {
        throw new Error(response.data.message || "Failed to fetch assignment");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
