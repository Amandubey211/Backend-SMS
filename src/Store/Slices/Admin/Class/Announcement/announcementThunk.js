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

export const fetchAnnouncements = createAsyncThunk(
  "announcement/fetchAnnouncements",
  async ({ cid, sid }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await getData(
        `/admin/announcement/class/${cid}/subject/${sid}?say=${say}`
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
  async ({ _id }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      await postData(
        `/admin/markAsRead/announcement/${_id}?say=${say}`,

        {
          params: { say },
        }
      );

      return _id;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchAnnouncementById = createAsyncThunk(
  "announcement/fetchAnnouncementById",
  async (id, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await getData(`/admin/announcement/${id}?say=${say}`);

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
  async (id, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await deleteData(`/admin/announcement/${id}?say=${say}`);

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
  async ({ data, files }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    if (files && files.attachment) {
      formData.append("attachment", files.attachment);
    }

    try {
      const response = await customRequest(
        "post",
        `/admin/announcement?say=${say}`,
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
  async ({ id, data, files }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    if (files && files.attachment) {
      formData.append("attachment", files.attachment);
    }

    try {
      const response = await customRequest(
        "put",
        `/admin/announcement/${id}?say=${say}`,
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
