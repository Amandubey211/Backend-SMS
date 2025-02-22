import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../Utils/academivYear";
import {
  postData,
  deleteData,
  putData,
  getData,
} from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";

export const createAssignmentThunk = createAsyncThunk(
  "assignment/createAssignment",
  async (assignmentData, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const endpoint = `/${getRole}/create_assignment?say=${say}`;

      const response = await postData(endpoint, assignmentData);

      if (response.success) {
        toast.success("Assignment created successfully!");
        return response.assignment;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateAssignmentThunk = createAsyncThunk(
  "assignment/updateAssignment",
  async (
    { assignmentId, assignmentData, sectionId },
    { rejectWithValue, dispatch, getState }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const endpoint = `/${getRole}/update_assignment/${assignmentId}?say=${say}`;

      const payload = {
        ...assignmentData,
        sectionId,
      };

      const response = await putData(endpoint, payload);

      if (response.success) {
        toast.success("Assignment updated successfully!");
        // Optionally, you can dispatch another thunk to fetch the updated assignment
        dispatch(fetchAssignmentByIdThunk(assignmentId));
        return response.assignment;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteAssignmentThunk = createAsyncThunk(
  "assignment/deleteAssignment",
  async (assignmentId, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const endpoint = `/${getRole}/delete_assignment/${assignmentId}?say=${say}`;

      const response = await deleteData(endpoint);

      if (response.success) {
        toast.success("Assignment deleted successfully!");
        return assignmentId;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchAssignmentsByClassThunk = createAsyncThunk(
  "assignment/fetchAssignmentsByClass",
  async (classId, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const endpoint = `/${getRole}/class_assignments/${classId}?say=${say}`;

      const response = await getData(endpoint);

      if (response.success) {
        return response.assignments;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchFilteredAssignments = createAsyncThunk(
  "assignments/fetchFiltered",
  async (
    { sid, moduleId, chapterId, publish },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const getRole = getUserRole(getState);
      const semesterId = getState().common.user.classInfo.selectedSemester.id;

      const say = getAY();
      dispatch(setShowError(false));
      const endpoint = `/${getRole}/assignments/${sid}?say=${say}`;

      const params = {
        ...(moduleId && { moduleId }),
        ...(chapterId && { chapterId }),
        ...(semesterId && { semesterId }),
        ...(publish !== undefined && { publish }),
      };

      const response = await getData(endpoint, params);

      // if (response.success) {
      return response?.assignments || [];
      // }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchAssignmentByIdThunk = createAsyncThunk(
  "assignment/fetchAssignmentById",
  async (assignmentId, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const endpoint = `/${getRole}/assignment/${assignmentId}?say=${say}`;

      const response = await getData(endpoint);

      if (response.success) {
        return response.assignment;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
