import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { fetchModules } from "./moduleThunk";
import { setSelectedModule } from "./moduleSlice";
import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";
import {
  ErrorMsg,
  handleError,
} from "../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../Utils/academivYear";
import {
  postData,
  customRequest,
  putData,
  deleteData,
} from "../../../../../services/apiEndpoints";

// thunks/chapterThunks.js

export const addChapter = createAsyncThunk(
  "chapter/addChapter",
  async (
    { name, thumbnail, moduleId, sid },
    { rejectWithValue, getState, dispatch }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const cid = getState().common.user.classInfo.selectedClassId;
      const subjectId = getState().common.user.subjectInfo.selectedSubjectId;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("moduleId", moduleId);
      formData.append("subjectId", subjectId);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const response = await customRequest(
        "post",
        "/admin/add_chapter",
        {},
        formData,
        {
          params: { say },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response && response.success) {
        toast.success(response.msg);
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

        return response.data;
      } else {
        throw new Error(response?.message || "Failed to add chapter.");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const editChapter = createAsyncThunk(
  "chapter/editChapter",
  async (
    { name, thumbnail, moduleId, chapterId, sid },
    { rejectWithValue, getState, dispatch }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const cid = getState().common.user.classInfo.selectedClassId;
      const subjectId = getState().common.user.subjectInfo.selectedSubjectId;

      const formData = new FormData();
      formData.append("name", name);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const endpoint = `/admin/subjects/${subjectId}/modules/${moduleId}/chapters/${chapterId}`;

      const response = await customRequest(
        "put",
        endpoint,
        formData,
        {},
        {
          params: { say },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response && response.success) {
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

      toast.success(response.msg);
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteChapter = createAsyncThunk(
  "chapter/deleteChapter",
  async (
    { moduleId, chapterId, sid },
    { rejectWithValue, getState, dispatch }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const cid = getState().common.user.classInfo.selectedClassId;
      const subjectId = getState().common.user.subjectInfo.selectedSubjectId;

      const endpoint = `/admin/subjects/${subjectId}/modules/${moduleId}/chapters/${chapterId}`;

      const response = await deleteData(endpoint, {
        params: { say },
      });

      if (response && response.success) {
        toast.success(response.msg);
        await dispatch(fetchModules({ cid, sid: subjectId }));

        const modules = getState().admin.module.modules;
        const updatedModule = modules.find((module) => module._id === moduleId);

        if (updatedModule) {
          dispatch(
            setSelectedModule({
              moduleId: updatedModule._id,
              name: updatedModule.moduleName,
              chapters: updatedModule.chapters,
            })
          );
        }

        return chapterId;
      } else {
        throw new Error(response?.message || "Failed to delete chapter.");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
