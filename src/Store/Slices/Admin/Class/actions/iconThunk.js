// iconThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";

// Fetch all icons
export const fetchAllIcons = createAsyncThunk(
  "icons/fetchAllIcons",
  async (_, { getState, rejectWithValue }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.get(`${baseUrl}/icons/getAllIcons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.icons;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch icons";
      console.error("Error fetching icons:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const createIcon = createAsyncThunk(
  "icons/createIcon",
  async (formData, { getState, rejectWithValue }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.post(
        `${baseUrl}/icons/createIcon`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create icon";
      console.error("Error creating icon:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateIcon = createAsyncThunk(
  "icons/updateIcon",
  async ({ iconData, iconId }, { getState, rejectWithValue }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.put(
        `${baseUrl}/icons/updateIcon/${iconId}`,
        iconData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.icon;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update icon";
      console.error("Error updating icon:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete an icon
export const deleteIcon = createAsyncThunk(
  "icons/deleteIcon",
  async (iconId, { getState, rejectWithValue }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      await axios.delete(`${baseUrl}/icons/deleteIcon/${iconId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Icon Deleted Successfully!");
      return iconId;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete icon";
      console.error("Error deleting icon:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
