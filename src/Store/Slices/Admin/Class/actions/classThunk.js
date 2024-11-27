import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getData,
  postData,
  putData,
  deleteData,
} from "../../../../../services/apiEndpoints"; // Adjust the path as necessary
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import toast from "react-hot-toast";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../Utils/academivYear";

export const fetchAllClasses = createAsyncThunk(
  "class/fetchAllClasses",
  async (_, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/class`;
      const params = { say };
      const response = await getData(endpoint, params);
      console.log(response, "lk");
      if (response && response.status) {
        return response.data; // Assuming 'data' contains the list of classes
      } else {
        throw new Error("Failed to fetch all classes");
      }
    } catch (error) {
      console.log(error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchClassDetails = createAsyncThunk(
  "class/fetchClassDetails",
  async (classId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/class/${classId}`;
      const params = { say };
      const response = await getData(endpoint, params);

      if (response && response.status) {
        return response.data; // Assuming 'data' contains class details
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createClass = createAsyncThunk(
  "class/createClass",
  async (classData, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/class`;
      const params = { say };
      const response = await postData(endpoint, classData, params);

      if (response && response.success) {
        toast.success("Class created successfully!");
        dispatch(fetchAllClasses()); // Refresh the classes list
        return response.data; // Assuming 'data' contains the created class
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateClass = createAsyncThunk(
  "class/updateClass",
  async ({ classData, classId }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/update_class/${classId}?say=${say}`;
      const response = await putData(endpoint, classData);

      if (response && response.success) {
        toast.success("Class updated successfully!");
        dispatch(fetchAllClasses()); // Refresh the classes list
        return response.data; // Assuming 'data' contains the updated class
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteClass = createAsyncThunk(
  "class/deleteClass",
  async (classId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/delete_class/${classId}?say=${say}`;
      const response = await deleteData(endpoint);

      if (response && response.success) {
        toast.success("Class deleted successfully!");
        dispatch(fetchAllClasses()); // Refresh the classes list
        return classId;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
