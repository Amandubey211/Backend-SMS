import { createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";

import { fetchModules } from "./moduleThunk";
import { setSelectedModule } from "./moduleSlice";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../Utils/academivYear";
import {
  customRequest,
  deleteData,
} from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";

// thunks/chapterThunks.js

export const addChapter = createAsyncThunk(
  "chapter/addChapter",
  async (
    { name, thumbnail, moduleId, sid },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));
      const cid = getState().common.user.classInfo.selectedClassId;
      const subjectId = getState().common.user.subjectInfo.selectedSubjectId;
      const semesterId = getState().common.user.classInfo.selectedSemester.id;
      const formData = new FormData();
      formData.append("name", name);
      formData.append("moduleId", moduleId);
      formData.append("subjectId", subjectId);
      formData.append("semesterId", semesterId);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const response = await customRequest(
        "post",
        `/${getRole}/add_chapter?say=${say}`,
        formData,
        {
          "Content-Type": "multipart/form-data",
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
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));
      const cid = getState().common.user.classInfo.selectedClassId;
      const subjectId = getState().common.user.subjectInfo.selectedSubjectId;
      const semesterId = getState().common.user.classInfo.selectedSemester.id;
      const formData = new FormData();
      formData.append("name", name);
      formData.append("semesterId", semesterId);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const endpoint = `/${getRole}/subjects/${subjectId}/modules/${moduleId}/chapters/${chapterId}?say=${say}`;

      const response = await customRequest("put", endpoint, formData, {
        "Content-Type": "multipart/form-data",
      });

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
      const getRole = getUserRole(getState);
      const cid = getState().common.user.classInfo.selectedClassId;
      const subjectId = getState().common.user.subjectInfo.selectedSubjectId;

      const endpoint = `/${getRole}/subjects/${subjectId}/modules/${moduleId}/chapters/${chapterId}?say=${say}`;

      const response = await deleteData(endpoint);

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
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
