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

export const createAssignmentThunk = createAsyncThunk(
  "assignment/createAssignment",
  async (assignmentData, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/create_assignment?say=${say}`;

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
    { rejectWithValue, dispatch }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/update_assignment/${assignmentId}?say=${say}`;
  
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
  async (assignmentId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/delete_assignment/${assignmentId}?say=${say}`;
     
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
  async (classId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/class_assignments/${classId}?say=${say}`;
 
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
    { rejectWithValue, dispatch }
  ) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const endpoint = `/admin/assignments/${sid}?say=${say}`;

     let params = { };
      if (moduleId) params.moduleId = moduleId;
      if (chapterId) params.chapterId = chapterId;
      if (publish !== null && publish !== undefined) params.publish = publish;

      const response = await getData(endpoint,params);

      if (response.success) {
        return response.assignments;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchAssignmentByIdThunk = createAsyncThunk(
  "assignment/fetchAssignmentById",
  async (assignmentId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/assignment/${assignmentId}?say=${say}`;
    
      const response = await getData(endpoint);

      if (response.success) {
        return response.assignment;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
