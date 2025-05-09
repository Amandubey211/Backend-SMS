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
import toast from "react-hot-toast";

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

export const deactiveDriver = createAsyncThunk(
  "transport/deactiveDriver",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await putData(
        `/transport/deactivate-driver/${userData.id}`
      );

      if (response.success) {
        toast.success("User deactivated successfully");
        fetchDriverList();
      } else {
        toast.error(response.message || "User deactivation failed");
      }

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Activate User

export const activeDriver = createAsyncThunk(
  "transport/activeDriver",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await putData(
        `/transport/activate-driver/${userData.id}`
      );

      if (response.success) {
        toast.success("User activated successfully");
        fetchDriverList();
      } else {
        toast.error(response.message || "User activation failed");
      }

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);