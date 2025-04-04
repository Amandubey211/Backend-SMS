import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";
import {
  postData,
  customRequest,
  deleteData,
  getData,
  putData,
} from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";

export const fetchAnnouncements = createAsyncThunk(
  "announcement/fetchAnnouncements",
  async ({ cid, sid }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const semesterId = getState().common.user.classInfo.selectedSemester.id; // Fetch semesterId correctly

      const response = await getData(
        `/${getRole}/announcement/class/${cid}/subject/${sid}?say=${say}&semesterId=${semesterId}`
      );

      if (response && response.status) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const markAsReadAnnouncement = createAsyncThunk(
  "announcement/markAsReadAnnouncement",
  async ({ _id }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      await postData(`/${getRole}/markAsRead/announcement/${_id}?say=${say}`);

      return _id;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchAnnouncementById = createAsyncThunk(
  "announcement/fetchAnnouncementById",
  async (id, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const response = await getData(
        `/${getRole}/announcement/${id}?say=${say}`
      );

      if (response && response.status) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  "announcement/deleteAnnouncement",
  async (id, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const response = await deleteData(
        `/${getRole}/announcement/${id}?say=${say}`
      );

      if (response && response.status) {
        toast.success("Announcement deleted successfully!");
        return id;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createAnnouncement = createAsyncThunk(
  "announcement/createAnnouncement",
  async (
    { data, files, navigate },
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

      // Construct FormData for multipart/form-data requests
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        const value = data[key];
        // If value is an array, append each item with the same key
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      });

      // Append semesterId to the body
      formData.append("semesterId", semesterId);

      if (files && files.attachment) {
        formData.append("attachment", files.attachment);
      }

      const response = await customRequest(
        "post",
        `/${getRole}/announcement?say=${say}`,
        formData,
        { "Content-Type": "multipart/form-data" }
      );

      if (response && response.status) {
        toast.success("Announcement created");
        navigate(-1);
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const editAnnouncement = createAsyncThunk(
  "announcement/editAnnouncement",
  async (
    { id, data, files, navigate },
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

      // Construct FormData for multipart/form-data requests
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      });

      // Append semesterId to the body
      formData.append("semesterId", semesterId);

      if (files && files.attachment) {
        formData.append("attachment", files.attachment);
      }

      const response = await customRequest(
        "put",
        `/${getRole}/announcement/${id}?say=${say}`,
        formData,
        { "Content-Type": "multipart/form-data" }
      );

      if (response && response.status) {
        toast.success("Announcement updated successfully!");
        navigate(-1);
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
