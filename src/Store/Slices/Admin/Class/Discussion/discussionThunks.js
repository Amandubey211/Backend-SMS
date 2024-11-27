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

export const fetchClassDiscussions = createAsyncThunk(
  "discussions/fetchClassDiscussions",
  async ({ cid }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await getData(`/admin/getDiscussion/class/${cid}`, {
        params: { say },
      });

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
  async ({ did }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await getData(`/admin/getDiscussionById/${did}`, {
        params: { say },
      });

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
  async ({ discussionData, cid }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    const formData = new FormData();
    Object.keys(discussionData).forEach((key) => {
      formData.append(key, discussionData[key]);
    });

    try {
      const response = await customRequest(
        "post",
        `/admin/createDiscussion/class/${cid}`,
        formData,
        {},
        {
          params: { say },
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
  async ({ discussionId, discussionData }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    const formData = new FormData();
    Object.keys(discussionData).forEach((key) => {
      formData.append(key, discussionData[key]);
    });

    try {
      const response = await customRequest(
        "put",
        `/admin/updateDiscussion/${discussionId}`,
        formData,
        {},
        {
          params: { say },
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
  async ({ discussionId }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await deleteData(
        `/admin/deleteDiscussion/${discussionId}`,
        {
          params: { say },
        }
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
  async ({ discussionId }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await putData(
        `/admin/discussion/readstatus/${discussionId}`,
        {},
        {
          params: { say },
        }
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
  async ({ discussionId, isPinned }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await putData(
        `/admin/discussion/pinstatus/${discussionId}`,
        { isPinned },
        {
          params: { say },
        }
      );

      if (response && response.success) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
