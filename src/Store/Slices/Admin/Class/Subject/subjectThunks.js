import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getData,
  postData,
  putData,
  deleteData,
} from "../../../../../services/apiEndpoints"; // Adjust the path as necessary
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { setSubjects } from "./subjectSlice"; // Adjust the path as necessary
import { fetchClassDetails } from "../actions/classThunk"; // Adjust the path as necessary
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";

export const fetchSubjects = createAsyncThunk(
  "subject/fetchSubjects",
  async (classId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/subject/${classId}?say=${say}`;
      const response = await getData(endpoint);

      if (response && response.status) {
        dispatch(setSubjects(response.data)); // Update the subjects state using the setSubjects action
        return response.data; // Assuming 'data' contains the list of subjects
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createSubject = createAsyncThunk(
  "subject/createSubject",
  async (subjectData, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/subject?say=${say}`;
      const response = await postData(endpoint, subjectData);

      if (response && response.status) {
        toast.success("Subject created successfully");
        dispatch(fetchClassDetails(subjectData.classId)); // Refresh class details
        return response.data; // Assuming 'data' contains the created subject
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateSubject = createAsyncThunk(
  "subject/updateSubject",
  async ({ subjectId, subjectData }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/subject/${subjectId}?say=${say}`;

      const response = await putData(endpoint, subjectData);

      if (response && response.status) {
        toast.success("Subject updated successfully");
        dispatch(fetchClassDetails(subjectData.classId)); // Refresh class details
        return response.data; // Assuming 'data' contains the updated subject
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteSubject = createAsyncThunk(
  "subject/deleteSubject",
  async ({ subjectId, classId }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/subject/${subjectId}?say=${say}`;
   
      const response = await deleteData(endpoint);

      if (response && response.success) {
        toast.success("Subject deleted successfully");
        dispatch(fetchClassDetails(classId)); // Refresh class details
        return subjectId;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
