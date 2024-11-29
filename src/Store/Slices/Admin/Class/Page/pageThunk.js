import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";
import {
  postData,
  deleteData,
  getData,
  putData,
} from "../../../../../services/apiEndpoints";

export const fetchAllPages = createAsyncThunk(
  "pages/fetchAllPages",
  async ({ cid }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await getData(`/admin/api/pages/class/pages/${cid}`, {
        params: { say },
      });

      if (response && response.success) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchPageById = createAsyncThunk(
  "pages/fetchPageById",
  async ({ pid }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await getData(`/admin/api/pages/${pid}`, {
        params: { say },
      });

      if (response && response.success) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createPage = createAsyncThunk(
  "pages/createPage",
  async ({ pageData, cid }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await postData(
        `/admin/api/pages/class/${cid}`,
        pageData,
        {
          params: { say },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.success) {
        toast.success("Page Created");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updatePage = createAsyncThunk(
  "pages/updatePage",
  async ({ pageId, pageData }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await putData(`/admin/api/pages/${pageId}`, pageData, {
        params: { say },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response && response.success) {
        toast.success("Page Updated Successfully");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deletePage = createAsyncThunk(
  "pages/deletePage",
  async ({ pid }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await deleteData(`/admin/api/pages/${pid}`, {
        params: { say },
      });

      if (response && response.success) {
        toast.success("Page Deleted Successfully");
        return pid;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
