import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";
import {
  customRequest,
  deleteData,
  getData,
  putData,
} from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";

export const fetchClassDiscussions = createAsyncThunk(
  "discussions/fetchClassDiscussions",
  async ({ cid, sid }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const response = await getData(
        `/${getRole}/getDiscussion/class/${cid}/subject/${sid}?say=${say}`
      );

      if (response && response.status) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchDiscussionById = createAsyncThunk(
  "discussions/fetchDiscussionById",
  async ({ did }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const response = await getData(
        `/${getRole}/getDiscussionById/${did}?say=${say}`
      );

      if (response && response.status) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createDiscussion = createAsyncThunk(
  "discussions/createDiscussion",
  async ({ discussionData, cid }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    const formData = new FormData();
    Object.keys(discussionData).forEach((key) => {
      formData.append(key, discussionData[key]);
    });

    try {
      const getRole = getUserRole(getState);
      const response = await customRequest(
        "post",
        `/${getRole}/createDiscussion/class/${cid}?say=${say}`,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      if (response && response.status) {
        toast.success("Discussion Created");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateDiscussion = createAsyncThunk(
  "discussions/updateDiscussion",
  async (
    { discussionId, discussionData },
    { rejectWithValue, dispatch, getState }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    const formData = new FormData();
    Object.keys(discussionData).forEach((key) => {
      formData.append(key, discussionData[key]);
    });

    try {
      const getRole = getUserRole(getState);
      const response = await customRequest(
        "put",
        `/${getRole}/updateDiscussion/${discussionId}?say=${say}`,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      if (response && response.status) {
        toast.success("Discussion Updated Successfully");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteDiscussion = createAsyncThunk(
  "discussions/deleteDiscussion",
  async ({ discussionId }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const response = await deleteData(
        `/${getRole}/deleteDiscussion/${discussionId}?say=${say}`
      );

      if (response && response.success) {
        toast.success("Discussion Deleted Successfully");
        return discussionId;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const markAsReadDiscussion = createAsyncThunk(
  "discussions/markAsReadDiscussion",
  async ({ discussionId }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/discussion/readstatus/${discussionId}?say=${say}`,
        {}
      );

      if (response && response.success) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updatePinStatus = createAsyncThunk(
  "discussions/updatePinStatus",
  async (
    { discussionId, isPinned },
    { rejectWithValue, dispatch, getState }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/discussion/pinstatus/${discussionId}?say=${say}`,
        { isPinned }
      );

      if (response && response.success) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
