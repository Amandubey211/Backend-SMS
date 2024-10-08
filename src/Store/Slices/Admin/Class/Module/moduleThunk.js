import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

// Fetch Modules Thunk
export const fetchModules = createAsyncThunk(
  "module/fetchModules",
  async ({ cid, sid }, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token; // Get token from state

      const response = await axios.get(
        `${baseUrl}/admin/student/classes/${cid}/modules/${sid}`,
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data.modules, "///////////");

      return response.data.data.modules;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching modules";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
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
      const token = getState().common.auth.token;
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;
      const formData = new FormData();
      formData.append("name", name);
      formData.append("subjectId", subjectId);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const response = await axios.post(
        `${baseUrl}/admin/add_module`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: `Bearer ${token}`,
          },
        }
      );

      toast.success("Module added successfully");
      if (response.data.success) {
        dispatch(fetchModules({ cid, sid }));
      }
      return response.data.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Error adding module";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
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
      const token = getState().common.auth.token;
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;
      const formData = new FormData();
      formData.append("name", name);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const response = await axios.put(
        `${baseUrl}/admin/subjects/${subjectId}/modules/${moduleId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: `Bearer ${token}`,
          },
        }
      );

      toast.success("Module updated successfully");
      if (response.data.success) {
        dispatch(fetchModules({ cid, sid }));
      }
      return response.data.data;
    } catch (error) {
      console.log(error, "//////");
      const errorMessage =
        error.response?.data?.message || "Error editing module";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete Module Thunk
export const deleteModule = createAsyncThunk(
  "module/deleteModule",
  async ({ sid, moduleId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      await axios.delete(
        `${baseUrl}/admin/subjects/${sid}/modules/${moduleId}`,
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );

      toast.success("Module deleted successfully");
      return moduleId;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error deleting module";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Move Module Thunk
export const moveModule = createAsyncThunk(
  "module/moveModule",
  async ({ moduleId, newIndex, sid }, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.put(
        `${baseUrl}/admin/subjects/${sid}/modules/reorder`,
        { moduleId, newIndex },
        {
          headers: {
            "Content-Type": "application/json",
            Authentication: `Bearer ${token}`,
          },
        }
      );

      toast.success("Module moved successfully");
      return response.data.data; // You can return the updated modules list or specific data as per your response
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error moving module";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
