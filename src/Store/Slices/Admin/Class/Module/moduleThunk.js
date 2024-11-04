import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";

const say = localStorage.getItem("say");

// Helper function to get the token from Redux state with centralized error handling
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

// Fetch Modules Thunk
export const fetchModules = createAsyncThunk(
  "module/fetchModules",
  async ({ cid, sid }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(
        `${baseUrl}/admin/student/classes/${cid}/modules/${sid}?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );
      return response.data.data.modules;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Add Module Thunk
export const addModule = createAsyncThunk(
  "module/addModule",
  async (
    { name, thumbnail, subjectId },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("subjectId", subjectId);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const response = await axios.post(
        `${baseUrl}/admin/add_module?say=${say}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: token,
          },
        }
      );

      toast.success("Module added successfully");
      if (response.data.success) {
        dispatch(fetchModules({ cid, sid }));
      }
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Edit Module Thunk
export const editModule = createAsyncThunk(
  "module/editModule",
  async (
    { moduleId, name, thumbnail, subjectId },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;

      const formData = new FormData();
      formData.append("name", name);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const response = await axios.put(
        `${baseUrl}/admin/subjects/${subjectId}/modules/${moduleId}?say=${say}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: token,
          },
        }
      );

      toast.success("Module updated successfully");
      if (response.data.success) {
        dispatch(fetchModules({ cid, sid }));
      }
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete Module Thunk
export const deleteModule = createAsyncThunk(
  "module/deleteModule",
  async ({ sid, moduleId }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      await axios.delete(
        `${baseUrl}/admin/subjects/${sid}/modules/${moduleId}?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );

      toast.success("Module deleted successfully");
      return moduleId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Move Module Thunk
export const moveModule = createAsyncThunk(
  "module/moveModule",
  async ({ moduleId, newIndex, sid }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.put(
        `${baseUrl}/admin/subjects/${sid}/modules/reorder?say=${say}`,
        { moduleId, newIndex },
        {
          headers: {
            "Content-Type": "application/json",
            Authentication: token,
          },
        }
      );

      toast.success("Module moved successfully");
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
