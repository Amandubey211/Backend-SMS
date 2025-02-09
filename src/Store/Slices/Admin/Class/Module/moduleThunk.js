import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import {
  putData,
  getData,
  deleteData,
  customRequest,
} from "../../../../../services/apiEndpoints";
import { getAY } from "../../../../../Utils/academivYear";
import { getUserRole } from "../../../../../Utils/getRoles";

export const fetchModules = createAsyncThunk(
  "module/fetchModules",
  async ({ cid, sid }, { rejectWithValue, dispatch, getState }) => {
    // Mandatory Lines
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      // API Call using service function with query parameter
      const response = await getData(
        `/${getRole}/student/classes/${cid}/modules/${sid}?say=${say}`
      );

      // Check if response is valid and indicates success
      if (response && response.success) {
        // Assuming 'modules' are nested within 'data.data'
        return response.data.modules;
      }
    } catch (error) {
      // Handle Errors
      console.error(error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const addModule = createAsyncThunk(
  "module/addModule",
  async (
    { name, thumbnail, subjectId },
    { rejectWithValue, dispatch, getState }
  ) => {
    // Retrieve additional necessary parameters
    const say = getAY();
    dispatch(setShowError(false)); // Ensure error visibility is reset

    try {
      const getRole = getUserRole(getState);
      // Extract class and subject IDs from the state
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;

      // Construct FormData for multipart/form-data requests
      const formData = new FormData();
      formData.append("name", name);
      formData.append("subjectId", subjectId);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      // Define the endpoint for the API call
      const endpoint = `/${getRole}/add_module?say=${say}`;

      const response = await customRequest("post", endpoint, formData, {
        "Content-Type": "multipart/form-data", // Specify the content type
      });

      if (response && response.success) {
        toast.success("Module added successfully");
        dispatch(fetchModules({ cid, sid }));
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const editModule = createAsyncThunk(
  "module/editModule",
  async (
    { moduleId, name, thumbnail, subjectId },
    { rejectWithValue, dispatch, getState }
  ) => {
    // Mandatory Lines
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;
      const semesterId = getState().common.user.cassInfo.selectedSemesterId;
      // Construct FormData for multipart/form-data
      const formData = new FormData();
      formData.append("name", name);
      formData.append("semesterId", semesterId);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      // API Call using customRequest for multipart/form-data with query parameter
      const endpoint = `/${getRole}/subjects/${subjectId}/modules/${moduleId}?say=${say}`;
      const response = await customRequest("put", endpoint, formData, {
        "Content-Type": "multipart/form-data",
      });

      if (response && response.success) {
        toast.success("Module updated successfully");
        dispatch(fetchModules({ cid, sid }));
        return response.data;
      }
    } catch (error) {
      console.error(error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteModule = createAsyncThunk(
  "module/deleteModule",
  async ({ sid, moduleId }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const endpoint = `/${getRole}/subjects/${sid}/modules/${moduleId}?say=${say}`;
      const response = await deleteData(endpoint);

      if (response && response.success) {
        toast.success("Module deleted successfully");
        return moduleId;
      }
    } catch (error) {
      console.error(error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const moveModule = createAsyncThunk(
  "module/moveModule",
  async (
    { moduleId, newIndex, sid },
    { rejectWithValue, dispatch, getState }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const endpoint = `/${getRole}/subjects/${sid}/modules/reorder?say=${say}`;
      const data = { moduleId, newIndex };
      const response = await putData(endpoint, data);

      if (response && response.success) {
        toast.success("Module moved successfully");
        return response.data; // not getting from the backend
      }
    } catch (error) {
      console.error(error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
