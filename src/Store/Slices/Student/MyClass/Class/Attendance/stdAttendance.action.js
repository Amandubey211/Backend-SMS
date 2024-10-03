import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../config/Common";
import { ErrorMsg } from "../../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../../Common/Alerts/alertsSlice";



export const stdAttendance = createAsyncThunk(
  'attendance/stdAttendance',
  async ({ month, year }, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("student:token");
    if (!token) {
      return rejectWithValue("Authentication failed!");
    }

    try {
      dispatch(setShowError(false));

      const res = await axios.get(
        `${baseUrl}/api/studentDashboard/myAttendance`,
        {
          params: { month, year },
          headers: {
            Authentication: token,
          },
        }
      );
      const data = res?.data?.report;
      console.log("Attendance in action:-->", data)
      //   const { report, summary } = res?.data?.report;
      //   const attendanceMap = report?.reduce((acc, entry) => {
      //     acc[entry?.date] = entry.status;
      //     return acc;
      //   }, {});

      //   setAttendanceData(attendanceMap);
      //   setSummary(summary);

      return data;
    } catch (error) {
      console.log("Error in student attendance", error);
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      return rejectWithValue(err.message);
    }
  }
)