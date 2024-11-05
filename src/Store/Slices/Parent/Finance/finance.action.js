import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";

const say = localStorage.getItem("say");

// Fetch finance data for parent
export const fetchParentFinanceData = createAsyncThunk(
  "dashboard/fetchAccountingData",
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("parent:token");

    if (!token) {
      const errorMessage = "Authentication failed";
      dispatch(setShowError(true));
      dispatch(setErrorMsg(errorMessage));
      return rejectWithValue(errorMessage);
    }

    try {
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
