import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";
import { getUserRole } from "../../../../Utils/getRoles";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchHelperList = createAsyncThunk(
  "transport/fetchHelperList",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(setShowError(false));

      const response = await getData(`/transport/get-helpers`);
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const addHelper = createAsyncThunk(
  "transport/addHelper",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(setShowError(false));

      const response = await postData(
        `/transport/create-helper`,
        data
      );
      dispatch(fetchHelperList());
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateHelper = createAsyncThunk(
  "transport/updateHelper",
  async ({ id, data }, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);

      dispatch(setShowError(false));

      const response = await putData(
        `/transport/update-helper/${id}`,
        data
      );
      dispatch(fetchHelperList());
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteHelper = createAsyncThunk(
  "transport/deleteHelper",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);

      dispatch(setShowError(false));

      const response = await deleteData(
        `/transport/delete-helper/${id}?say=${say}`
      );
      dispatch(fetchHelperList());
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
