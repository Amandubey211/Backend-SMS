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

// Add Attachment Thunk
export const addAttachment = createAsyncThunk(
  "attachment/addAttachment",
  async (
    { chapterId, subjectId, documents, documentLabels },
    { rejectWithValue, getState, dispatch }
  ) => {
    const say = localStorage.getItem("say")
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;

      const formData = new FormData();
      formData.append("chapterId", chapterId);
      formData.append("subjectId", subjectId);
      documents.forEach((document, index) => {
        formData.append("documents", document);
        formData.append("documentLabels", documentLabels[index] || "");
      });

      const response = await axios.put(
        `${baseUrl}/admin/uploadChapterFiles?say=${say}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: token,
          },
        }
      );

      toast.success("Documents uploaded successfully.");

      // Fetch updated modules after adding attachments
      await dispatch(fetchModules({ cid, sid }));

      // Get updated modules and find the updated module
      const modules = getState().admin.module.modules;
      const updatedModule = modules.find((module) =>
        module.chapters.some((chapter) => chapter._id === chapterId)
      );

      // Update selectedModule with the new chapter containing the added attachments
      if (updatedModule) {
        dispatch(setSelectedModule(updatedModule));
      }

      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete Attachment Thunk
export const deleteAttachmentThunk = createAsyncThunk(
  "attachment/deleteAttachment",
  async (
    { chapterId, subjectId, fileUrl },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;

      const response = await axios.put(
        `${baseUrl}/admin/removeChapterFiles?say=${say}`,
        { chapterId, subjectId, fileUrl },
        {
          headers: {
            Authentication: token,
          },
        }
      );

      toast.success("Attachment deleted successfully.");

      // Fetch updated modules after deleting attachments
      await dispatch(fetchModules({ cid, sid }));

      // Get updated modules and find the updated module
      const modules = getState().admin.module.modules;
      const updatedModule = modules.find((module) =>
        module.chapters.some((chapter) => chapter._id === chapterId)
      );

      // Update selectedModule with the new chapter containing the updated attachments
      if (updatedModule) {
        dispatch(setSelectedModule(updatedModule));
      }

      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
