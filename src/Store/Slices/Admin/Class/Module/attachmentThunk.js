import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { fetchModules } from "./moduleThunk";
import { setSelectedModule } from "./moduleSlice";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../Utils/academivYear";
import { customRequest, putData } from "../../../../../services/apiEndpoints";

export const addAttachment = createAsyncThunk(
  "attachment/addAttachment",
  async (
    { chapterId, subjectId, documents, documentLabels },
    { rejectWithValue, getState, dispatch }
  ) => {
    // Mandatory Lines
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;

      const formData = new FormData();
      formData.append("chapterId", chapterId);
      formData.append("subjectId", subjectId);
      documents.forEach((document, index) => {
        formData.append("documents", document);
        formData.append("documentLabels", documentLabels[index] || "");
      });

      const response = await customRequest(
        "put",
        `/admin/uploadChapterFiles?say=${say}`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response && response.uploadedFiles?.length) {
        toast.success("Documents uploaded successfully.");
        await dispatch(fetchModules({ cid, sid }));

        const modules = getState().admin.module.modules;
        const updatedModule = modules.find((module) =>
          module.chapters.some((chapter) => chapter._id === chapterId)
        );

        if (updatedModule) {
          dispatch(setSelectedModule(updatedModule));
        }

        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteAttachmentThunk = createAsyncThunk(
  "attachment/deleteAttachment",
  async (
    { chapterId, subjectId, fileUrl },
    { rejectWithValue, getState, dispatch }
  ) => {
    // Mandatory Lines
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;

      const payload = { chapterId, subjectId, fileUrl };

      const response = await putData(`/admin/removeChapterFiles?say=${say}`, payload);

      if (response && response.message == "File deleted successfully") {
        await dispatch(fetchModules({ cid, sid }));

        const modules = getState().admin.module.modules;
        const updatedModule = modules.find((module) =>
          module.chapters.some((chapter) => chapter._id === chapterId)
        );

        if (updatedModule) {
          dispatch(setSelectedModule(updatedModule));
        }

        return response.data;
      }
    } catch (error) {
      console.error("Delete Attachment Error:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
