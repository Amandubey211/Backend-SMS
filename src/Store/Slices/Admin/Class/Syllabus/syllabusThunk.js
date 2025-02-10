import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../../Utils/academivYear";
import {
  postData,
  customRequest,
  deleteData,
  getData,
} from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";

export const fetchSyllabus = createAsyncThunk(
  "syllabus/fetchSyllabus",
  async ({ subjectId, classId }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const semesterId = getState().common.user.classInfo.selectedSemester.id; // Fetch semesterId correctly

      const response = await getData(
        `/${getRole}/syllabus/${subjectId}/class/${classId}?say=${say}&semesterId=${semesterId}`
      );

      if (response && response.status) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteSyllabus = createAsyncThunk(
  "syllabus/deleteSyllabus",
  async (syllabusId, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const response = await deleteData(
        `/${getRole}/syllabus/${syllabusId}?say=${say}`
      );

      if (response && response.status) {
        toast.success("Syllabus deleted successfully!");
        return syllabusId;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createSyllabus = createAsyncThunk(
  "syllabus/createSyllabus",
  async (
    { title, content, subjectId },
    { rejectWithValue, dispatch, getState }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const semesterId = getState().common.user.classInfo.selectedSemester?.id; // Ensure safe access

      if (!semesterId) {
        throw new Error("Semester ID is missing");
      }

      // Include semesterId in the request body
      const payload = { title, content, subjectId, semesterId };

      const response = await postData(
        `/${getRole}/syllabus?say=${say}`,
        payload
      );

      if (response && response.status) {
        toast.success("Syllabus created successfully!");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const editSyllabus = createAsyncThunk(
  "syllabus/editSyllabus",
  async (
    { syllabusId, data, cid },
    { rejectWithValue, dispatch, getState }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      const endpoint = `/${getRole}/syllabus/${syllabusId}/class/${cid}?say=${say}`;
      const response = await customRequest("put", endpoint, formData, {
        "Content-Type": "multipart/form-data",
      });

      if (response && response.status) {
        toast.success("Syllabus updated successfully!");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
