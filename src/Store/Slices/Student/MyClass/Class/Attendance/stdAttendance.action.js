import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../config/Common";
import { ErrorMsg } from "../../../../Common/Alerts/errorhandling.action";
import { setErrorMsg, setShowError } from "../../../../Common/Alerts/alertsSlice";

const say = localStorage.getItem("say");

export const stdAttendance = createAsyncThunk(
  'attendance/stdAttendance',
  async ({ month, year }, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("student:token");
    if (!token) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Authentication failed!"));
      return rejectWithValue("Authentication failed!");
    }

    try {
      dispatch(setShowError(false));

      const res = await axios.get(
        `${baseUrl}/api/studentDashboard/myAttendance?say=${say}`,
        {
          params: { month, year },
          headers: { Authentication: token },
        }
      );
      const data = res?.data?.report;
      console.log("Attendance in action:", data);

      return data;
    } catch (error) {
      console.error("Error in student attendance:", error);
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err.message));
      return rejectWithValue(err.message);
    }
  }
);
