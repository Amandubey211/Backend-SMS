import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
const say = localStorage.getItem('say');

// Fetch all events
export const fetchAllEvents = createAsyncThunk(
  "events/fetchAll",
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("parent:token");

    if (!token) {
      const errorMessage = "Authentication failed";
     
      dispatch(setShowError(true));
      dispatch(setErrorMsg(errorMessage));
      return rejectWithValue(errorMessage) 
    }

    try {
      const response = await axios.get(`${baseUrl}/admin/all/events?say=${say}`, {
        headers: {
          Authentication: `${token}`,
        },
      });
      return response.data.events;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch events";
     const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message)
    }
  }
);
