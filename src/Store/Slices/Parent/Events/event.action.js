// eventThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import toast from "react-hot-toast";

// Fetch all events
export const fetchAllEvents = createAsyncThunk(
  "events/fetchAll",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("parent:token");

    if (!token) {
      const errorMessage = "Token not found";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); // Reject with custom error
    }

    try {
      const response = await axios.get(`${baseUrl}/admin/all/events`, {
        headers: {
          Authentication: `${token}`,
        },
      });
      return response.data.events;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch events";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
