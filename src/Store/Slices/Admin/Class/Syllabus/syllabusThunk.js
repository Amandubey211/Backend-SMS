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
    { title, content, subjectId, groupIds = [], sectionIds = [], navigate },
    { rejectWithValue, dispatch, getState }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      // Safely retrieve the semesterId from the Redux state
      const semesterId = getState().common.user.classInfo.selectedSemester?.id;

      if (!semesterId) {
        throw new Error("Semester ID is missing");
      }

      // Construct the payload including semesterId and audience selections
      const payload = {
        title,
        content,
        subjectId,
        semesterId,
        groupIds,
        sectionIds,
      };

      const response = await postData(
        `/${getRole}/syllabus?say=${say}`,
        payload
      );

      if (response && response.status) {
        toast.success("Syllabus created successfully!");
        // Redirect only for create operation
        if (navigate) navigate(-1);
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
    { syllabusId, data, cid, navigate },
    { rejectWithValue, dispatch, getState }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const formData = new FormData();
      // Loop over each key in data and check if it's an array
      for (const key in data) {
        if (Array.isArray(data[key])) {
          data[key].forEach((item) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, data[key]);
        }
      }

      const endpoint = `/${getRole}/syllabus/${syllabusId}/class/${cid}?say=${say}`;
      const response = await customRequest("put", endpoint, formData, {
        "Content-Type": "multipart/form-data",
      });

      if (response && response.status) {
        navigate(-1);
        toast.success("Syllabus updated successfully!");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
