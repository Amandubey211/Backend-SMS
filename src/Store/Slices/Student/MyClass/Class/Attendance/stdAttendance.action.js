import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorMsg } from "../../../../Common/Alerts/errorhandling.action";
import {
  setErrorMsg,
  setShowError,
} from "../../../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../../../Utils/academivYear";
import { getData } from "../../../../../../services/apiEndpoints";

export const stdAttendance = createAsyncThunk(
  "attendance/stdAttendance",
  async ({ month, year }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));

      const res = await getData(`/admin/myAttendance?say=${say}`, {
        month,
        year,
      });
      const data = res?.report;
      // console.log("Attendance in action:", data);

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
