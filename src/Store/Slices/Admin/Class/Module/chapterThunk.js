import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { fetchModules } from "./moduleThunk";
import { setSelectedModule } from "./moduleSlice";
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

// Add Chapter Thunk
export const addChapter = createAsyncThunk(
  "chapter/addChapter",
  async (
    { name, thumbnail, moduleId, sid },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const cid = getState().common.user.classInfo.selectedClassId;
      const subjectId = getState().common.user.subjectInfo.selectedSubjectId;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("moduleId", moduleId);
      formData.append("subjectId", subjectId);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const response = await axios.post(
        `${baseUrl}/admin/add_chapter?say=${say}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: token,
          },
        }
      );

      toast.success(response.data.msg);

      if (response.data.success) {
        await dispatch(fetchModules({ cid, sid: subjectId }));

        const updatedModules = getState().admin.module.modules;
        const updatedModule = updatedModules.find(
          (module) => module._id === moduleId
        );

        if (updatedModule) {
          dispatch(
            setSelectedModule({
              moduleId: updatedModule._id,
              name: updatedModule.moduleName,
              chapters: updatedModule.chapters,
            })
          );
        }
      }

      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Edit Chapter Thunk
export const editChapter = createAsyncThunk(
  "chapter/editChapter",
  async (
    { name, thumbnail, moduleId, chapterId, sid },
    { rejectWithValue, getState, dispatch }
  ) => {

    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const cid = getState().common.user.classInfo.selectedClassId;
      const subjectId = getState().common.user.subjectInfo.selectedSubjectId;

      const formData = new FormData();
      formData.append("name", name);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const response = await axios.put(
        `${baseUrl}/admin/subjects/${subjectId}/modules/${moduleId}/chapters/${chapterId}?say=${say}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: token,
          },
        }
      );

      if (response.data.success) {
        await dispatch(fetchModules({ cid, sid: subjectId }));

        const updatedModules = getState().admin.module.modules;
        const updatedModule = updatedModules.find(
          (module) => module._id === moduleId
        );

        if (updatedModule) {
          dispatch(
            setSelectedModule({
              moduleId: updatedModule._id,
              name: updatedModule.moduleName,
              chapters: updatedModule.chapters,
            })
          );
        }
      }

      toast.success(response.data.msg);
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete Chapter Thunk
export const deleteChapter = createAsyncThunk(
  "chapter/deleteChapter",
  async (
    { moduleId, chapterId, sid },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const cid = getState().common.user.classInfo.selectedClassId;
      const subjectId = getState().common.user.subjectInfo.selectedSubjectId;

      const response = await axios.delete(
        `${baseUrl}/admin/subjects/${subjectId}/modules/${moduleId}/chapters/${chapterId}?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );

      toast.success(response.data.msg);

      if (response.data.success) {
        await dispatch(fetchModules({ cid, sid: subjectId }));

        const updatedModules = getState().admin.module.modules;
        const updatedModule = updatedModules.find(
          (module) => module._id === moduleId
        );

        if (updatedModule) {
          dispatch(
            setSelectedModule({
              moduleId: updatedModule._id,
              name: updatedModule.moduleName,
              chapters: updatedModule.chapters,
            })
          );
        }
      }

      return chapterId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
