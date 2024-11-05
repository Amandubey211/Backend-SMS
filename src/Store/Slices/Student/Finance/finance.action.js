import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../config/Common";
import axios from "axios";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";

const say = localStorage.getItem("say");

// fetch student fees details
export const StudentFinanceDetails = createAsyncThunk(
  `fees/StudentFinanceDetails`,
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("student:token");
    if (!token) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Authentication failed!"));
      return rejectWithValue("Authentication failed!");
    }
    const say = localStorage.getItem("say")
    try {
      dispatch(setShowError(false));

      const res = await axios.get(`${baseUrl}/student/my_fees?say=${say}`, {
        headers: { Authentication: token },
      });
      const data = res?.data;

      return data;
    } catch (error) {
      console.error("Error in StudentFinanceDetails:", error);
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err.message);
    }
  }
);
