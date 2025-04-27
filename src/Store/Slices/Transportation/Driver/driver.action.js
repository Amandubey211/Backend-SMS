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

export const fetchDriverList = createAsyncThunk(
  "transport/fetchDriverList",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      // const say = getAY();
      const role = getUserRole(getState);

      dispatch(setShowError(false));

      const response = await getData(`/transport/get-drivers`);
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const addDriver = createAsyncThunk(
  "transport/addDriver",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);

      dispatch(setShowError(false));

      const response = await postData(
        `/transport/create-driver?say=${say}`,
        data
      );
      dispatch(fetchDriverList());
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateDriver = createAsyncThunk(
  "transport/updateDriver",
  async ({ id, data }, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);

      dispatch(setShowError(false));

      const response = await putData(
        `/transport/update-driver/${id}?say=${say}`,
        data
      );
      dispatch(fetchDriverList());
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteDriver = createAsyncThunk(
  "transport/deleteDriver",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);

      dispatch(setShowError(false));

      const response = await deleteData(
        `/transport/delete-driver/${id}?say=${say}`
      );
      dispatch(fetchDriverList());
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
