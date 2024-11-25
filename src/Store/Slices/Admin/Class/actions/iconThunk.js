import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getData,
  postData,
  putData,
  deleteData,
} from "../../../../../services/apiEndpoints"; // Adjust the path as necessary
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";

export const fetchAllIcons = createAsyncThunk(
  "icons/fetchAllIcons",
  async ({ type }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/icons/getAllIcons`;
      const params = { say, type };
      const response = await getData(endpoint, { params });

      if (response && response.success) {
        return response.icons; // Assuming 'icons' contains the list of icons
      } else {
        throw new Error(response.message || "Failed to fetch icons");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createIcon = createAsyncThunk(
  "icons/createIcon",
  async (formData, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/icons/createIcon`;
      const params = { say };
      const response = await postData(endpoint, formData, { params });

      if (response && response.success) {
        toast.success("Icon created successfully!");
        dispatch(fetchAllIcons({ type: formData.get("type") })); // Refresh the icons list based on type
        return response.data; // Assuming 'data' contains the created icon
      } else {
        throw new Error(response.message || "Failed to create icon");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateIcon = createAsyncThunk(
  "icons/updateIcon",
  async ({ iconData, iconId }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/icons/updateIcon/${iconId}`;
      const params = { say };
      const response = await putData(endpoint, iconData, { params });

      if (response && response.success) {
        toast.success("Icon updated successfully!");
        dispatch(fetchAllIcons({ type: iconData.get("type") })); // Refresh the icons list based on type
        return response.icon; // Assuming 'icon' contains the updated icon
      } else {
        throw new Error(response.message || "Failed to update icon");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteIcon = createAsyncThunk(
  "icons/deleteIcon",
  async ({ iconId, type }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/icons/deleteIcon/${iconId}`;
      const params = { say };
      const response = await deleteData(endpoint, { params });

      if (response && response.success) {
        toast.success("Icon deleted successfully!");
        dispatch(fetchAllIcons({ type })); // Refresh the icons list based on type
        return iconId;
      } else {
        throw new Error(response.message || "Failed to delete icon");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
