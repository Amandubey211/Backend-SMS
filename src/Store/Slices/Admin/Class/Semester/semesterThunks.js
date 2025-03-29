// semesterThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../Utils/academivYear";
import {
  customRequest,
  deleteData,
  getData,
} from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";
import toast from "react-hot-toast";

// Fetch semesters for the selected class (classId derived from state)
export const fetchSemestersByClass = createAsyncThunk(
  "semesters/fetchSemestersByClass",
  async (classId, { rejectWithValue, dispatch, getState }) => {
    const cid = classId || getState().common.user.classInfo.selectedClassId;
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const response = await getData(
        `/admin/get-semester?classId=${cid}&say=${say}`
      );
      if (response && response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to fetch semesters");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Create a new semester and then refresh the semester list
export const createSemester = createAsyncThunk(
  "semesters/createSemester",
  async ({ semesterData }, { rejectWithValue, dispatch, getState }) => {
    const cid = getState().common.user.classInfo.selectedClassId;
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await customRequest(
        "post",
        `/${getRole}/create-semester?say=${say}`,
        { ...semesterData, classId: cid },
        { "Content-Type": "application/json" }
      );
      if (response && response.success) {
        // Removed toast.success here to avoid duplicate notifications.
        // Re-fetch semesters after creation
        await dispatch(fetchSemestersByClass());
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to create semester");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update an existing semester and then refresh the semester list
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
        { "Content-Type": "application/json" }
      );
      if (response && response.success) {
        // Removed toast.success here to avoid duplicate notifications.
        // Re-fetch semesters after update
        await dispatch(fetchSemestersByClass());
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to update semester");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete a semester and then refresh the semester list
// semesterThunks.js
// semesterThunks.js
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
        // Re-fetch semesters after deletion
        await dispatch(fetchSemestersByClass());
        return semesterId;
      } else {
        const errMsg =
          (response && response?.message) || "Failed to delete semester";
        return rejectWithValue(errMsg);
      }
    } catch (error) {
      // Ensure error message is defined before rejecting
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
