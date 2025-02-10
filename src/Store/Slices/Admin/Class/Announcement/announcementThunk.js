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
  async ({ data, files }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    if (files && files.attachment) {
      formData.append("attachment", files.attachment);
    }

    try {
      const getRole = getUserRole(getState);
      const semesterId = getState().common.user.classInfo.selectedSemester.id; // Fetch semesterId correctly

      const response = await customRequest(
        "post",
        `/${getRole}/announcement?say=${say}&semesterId=${semesterId}`,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      if (response && response.status) {
        toast.success("Announcement created");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const editAnnouncement = createAsyncThunk(
  "announcement/editAnnouncement",
  async ({ id, data, files }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    if (files && files.attachment) {
      formData.append("attachment", files.attachment);
    }

    try {
      const getRole = getUserRole(getState);
      const semesterId = getState().common.user.classInfo.selectedSemester.id; // Fetch semesterId correctly

      const response = await customRequest(
        "put",
        `/${getRole}/announcement/${id}?say=${say}&semesterId=${semesterId}`,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      if (response && response.status) {
        toast.success("Announcement updated successfully!");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
