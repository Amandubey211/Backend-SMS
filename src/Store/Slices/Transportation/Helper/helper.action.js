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

export const deactiveHelper = createAsyncThunk(
  "transport/deactiveHelper",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await putData(
        `/transport/deactivate-helper/${userData.id}`
      );

      if (response.success) {
        toast.success("User deactivated successfully");
        fetchHelperList();
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

export const activeHelper = createAsyncThunk(
  "transport/activeHelper",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      console.log(userData, "userData in activeHelper action");
      const response = await putData(
        `/transport/activate-helper/${userData.id}`
      );

      if (response.success) {
        toast.success("User activated successfully");
        fetchHelperList();
      } else {
        toast.error(response.message || "User activation failed");
      }

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);