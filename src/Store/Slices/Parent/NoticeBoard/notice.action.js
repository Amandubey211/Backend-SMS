import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";

const say = localStorage.getItem("say");

// Async thunk to fetch all notices
export const fetchAllNotices = createAsyncThunk(
  "dashboard/fetchNotices",
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("parent:token");

    if (!token) {
      const errorMessage = "No token found";
      dispatch(setShowError(true));
      dispatch(setErrorMsg(errorMessage));
      return rejectWithValue(errorMessage);
    }

    try {
      const response = await axios.get(`${baseUrl}/admin/all/notices?say=${say}`, {
        headers: {
          Authentication: `${token}`,
        },
      });
      console.log("API Response for Notices:", response.data.notices);
      return response.data.notices;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch notices";
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message)
    }
  }
);
