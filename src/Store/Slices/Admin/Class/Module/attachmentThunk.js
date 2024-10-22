import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { fetchModules } from "./moduleThunk";
import { setSelectedModule } from "./moduleSlice";

// Add Attachment Thunk
export const addAttachment = createAsyncThunk(
  "attachment/addAttachment",
  async (
    { chapterId, subjectId, documents, documentLabels },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const token = getState().common.auth.token;
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
        `${baseUrl}/admin/uploadChapterFiles`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: `Bearer ${token}`,
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
    } catch (err) {
      const message =
        err.response?.data?.message || "Error uploading documents";
      toast.error(message);
      return rejectWithValue(message);
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
      const token = getState().common.auth.token;
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;

      const response = await axios.put(
        `${baseUrl}/admin/removeChapterFiles`,
        { chapterId, subjectId, fileUrl },
        {
          headers: {
            Authentication: `Bearer ${token}`,
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
    } catch (err) {
      const message =
        err.response?.data?.message || "Error deleting attachment";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
