
import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../config/Common";
import axios from "axios";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";



// fetch student fees details
export const StudentFinanceDetails = createAsyncThunk(
  `fees/StudentFinanceDetails`,
  async (_, { rejectWithValue, dispatch }) => {
    // dispatch(setShowError(false));
    const token = localStorage.getItem("student:token");
    if (!token) {
      return rejectWithValue(`Authentication failed!`);
    }
    
    try {
      dispatch(setShowError(false));

      const res = await axios.get(`${baseUrl}/student/my_fees`, {
        headers: { Authentication: token },
      });

      const data = res?.data;

      return data;
    } catch (error) {
      console.log("Error in StudentFinanceDetails:", error);
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      return rejectWithValue(err.message);
    }
  }
)

