// semesterThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";
import {
  customRequest,
  deleteData,
  getData,
  putData,
} from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";

// Fetch semesters for a specific class
export const fetchSemestersByClass = createAsyncThunk(
  "semesters/fetchSemestersByClass",
  async ({ classId }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await getData(
        `/${getRole}/get-semester?classId=${classId}&say=${say}`
      );
      if (response && response.success) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Create a new semester
export const createSemester = createAsyncThunk(
  "semesters/createSemester",
  async (
    { semesterData, classId },
    { rejectWithValue, dispatch, getState }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      // Merge classId into the payload as expected by the backend
      const response = await customRequest(
        "post",
        `/${getRole}/create-semester?say=${say}`,
        { ...semesterData, classId },
        {
          "Content-Type": "application/json",
        }
      );
      if (response && response.success) {
        toast.success("Semester created successfully");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update an existing semester
export const updateSemester = createAsyncThunk(
  "semesters/updateSemester",
  async (
    { semesterId, semesterData },
    { rejectWithValue, dispatch, getState }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await customRequest(
        "put",
        `/${getRole}/update-semester/${semesterId}?say=${say}`,
        semesterData,
        {
          "Content-Type": "application/json",
        }
      );
      if (response && response.success) {
        toast.success("Semester updated successfully");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete a semester
export const deleteSemester = createAsyncThunk(
  "semesters/deleteSemester",
  async ({ semesterId }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await deleteData(
        `/${getRole}/delete-semester/${semesterId}?say=${say}`
      );
      if (response && response.success) {
        toast.success("Semester deleted successfully");
        return semesterId;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
