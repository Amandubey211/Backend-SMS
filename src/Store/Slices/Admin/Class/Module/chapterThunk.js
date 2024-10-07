import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { fetchModules } from "./moduleThunk";
import { setSelectedModule } from "./moduleSlice";

// Add Chapter Thunk
export const addChapter = createAsyncThunk(
  "chapter/addChapter",
  async (
    { name, thumbnail, moduleId, sid },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const token = getState().common.auth.token; // Get token from state
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("moduleId", moduleId);
      formData.append("subjectId", sid);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const response = await axios.post(
        `${baseUrl}/admin/add_chapter`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.msg);

      if (response.data.success) {
        // Fetch updated modules after chapter is added
        await dispatch(fetchModules({ cid, sid }));

        // Retrieve updated modules from state
        const updatedModules = getState().admin.module.modules;

        // Find the updated module by moduleId
        const updatedModule = updatedModules.find(
          (module) => module._id === moduleId
        );

        if (updatedModule) {
          // Explicitly set the updated module as the selected one
          dispatch(
            setSelectedModule({
              moduleId: updatedModule._id,
              name: updatedModule.moduleName,
              chapters: updatedModule.chapters,
            })
          );
        }
      }

      return response.data.data; // Return new chapter data
    } catch (err) {
      const message = err.response?.data?.msg || "Failed to add chapter.";
      toast.error(message);
      return rejectWithValue(message);
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
      const token = getState().common.auth.token; // Get token from state
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;

      const formData = new FormData();
      formData.append("name", name);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const response = await axios.put(
        `${baseUrl}/admin/subjects/${sid}/modules/${moduleId}/chapters/${chapterId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Fetch updated modules after chapter is edited
        await dispatch(fetchModules({ cid, sid }));

        // Retrieve updated modules from state
        const updatedModules = getState().admin.module.modules;

        // Find the updated module by moduleId
        const updatedModule = updatedModules.find(
          (module) => module._id === moduleId
        );

        if (updatedModule) {
          // Explicitly set the updated module as the selected one
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
      return response.data.data; // Return updated chapter data
    } catch (err) {
      const message = err.response?.data?.msg || "Failed to edit chapter.";
      toast.error(message);
      return rejectWithValue(message);
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
      const token = getState().common.auth.token; // Get token from state
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;

      // API call to delete chapter
      const response = await axios.delete(
        `${baseUrl}/admin/subjects/${sid}/modules/${moduleId}/chapters/${chapterId}`,
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );

      // Show success message if the deletion is successful
      toast.success(response.data.msg);

      if (response.data.success) {
        // Fetch updated modules after chapter is edited
        await dispatch(fetchModules({ cid, sid }));

        // Retrieve updated modules from state
        const updatedModules = getState().admin.module.modules;

        // Find the updated module by moduleId
        const updatedModule = updatedModules.find(
          (module) => module._id === moduleId
        );

        if (updatedModule) {
          // Explicitly set the updated module as the selected one
          dispatch(
            setSelectedModule({
              moduleId: updatedModule._id,
              name: updatedModule.moduleName,
              chapters: updatedModule.chapters,
            })
          );
        }
      }

      return chapterId; // Return the deleted chapter ID
    } catch (err) {
      const message = err.response?.data?.msg || "Failed to delete chapter.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
