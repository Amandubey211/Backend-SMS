import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
const say = localStorage.getItem('say');

// Fetch dashboard cards
export const fetchDashboardCards = createAsyncThunk(
  "dashboard/fetchCards",
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("parent:token");
    if (!token) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Authentication failed"));
      return rejectWithValue("Authentication failed");
    }

    try {
      dispatch(setShowError(false));
      const response = await axios.get(`${baseUrl}/parent/api/dashboard/sections?say=${say}`, {
        headers: {
          Authentication: `${token}`,
        },
      });

      if (response.data.success) {
        console.log("API Response for Dashboard Cards:", response.data);
        return response.data;
      } else {
        return rejectWithValue("Failed to fetch dashboard data");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch dashboard data";
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch notices
export const fetchNotices = createAsyncThunk(
  "dashboard/fetchNotices",
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("parent:token");

    if (!token) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Authentication failed"));
      return rejectWithValue("Authentication failed");
    }

    try {
      dispatch(setShowError(false));
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
      return rejectWithValue(err?.message);
    }
  }
);

// Fetch children data
export const fetchChildren = createAsyncThunk(
  "dashboard/fetchChildren",
  async (_, { rejectWithValue, dispatch }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = localStorage.getItem("parent:token");

    if (!userData || !userData.email) {
      const errorMessage = "No guardian email found";
      dispatch(setErrorMsg(errorMessage));
      return rejectWithValue(errorMessage)
    }

    try {
      dispatch(setShowError(false));
      const response = await axios.get(`${baseUrl}/parent/api/children?say=${say}`, {
        headers: {
          Authentication: `${token}`,
        },
      });
      return response.data.children;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch children data";
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message);
    }
  }
);

// Fetch accounting data (fees, paid, unpaid, etc.)
export const fetchAccountingData = createAsyncThunk(
  "dashboard/fetchAccountingData",
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("parent:token");

    if (!token) {
      const errorMessage = "Authentication failed";
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Authentication failed"));
      return rejectWithValue(errorMessage)
    }

    try {
      dispatch(setShowError(false));
      const response = await axios.get(`${baseUrl}/parent/api/fees?say=${say}`, {
        headers: {
          Authentication: `${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch accounting data";
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message);
    }
  }
);
