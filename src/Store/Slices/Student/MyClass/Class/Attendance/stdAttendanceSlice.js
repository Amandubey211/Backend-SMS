import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { stdAttendance } from "./stdAttendance.action";

const initialState = {
  loading: false,
  error: false,
  attendanceData: {},
  summary: {
    presentCount: 0,
    absentCount: 0,
    leaveCount: 0,
  },
  currentDate: moment(), // Ensure moment instance
};

const stdAttendanceSlice = createSlice({
  name: "studentAttendance",
  initialState,
  reducers: {
    setCurrentDate: (state, action) => {
      state.currentDate = moment(action.payload); // Ensure moment object
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(stdAttendance.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(stdAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;

        // Ensure payload structure is valid
        const { summary, report } = action.payload || {};
        state.summary = summary || {
          presentCount: 0,
          absentCount: 0,
          leaveCount: 0,
        };

        // Convert report array to an object mapping dates to status
        state.attendanceData =
          Array.isArray(report) && report.length > 0
            ? report.reduce((acc, entry) => {
                if (entry?.date && entry?.status) {
                  acc[entry.date] = entry.status;
                }
                return acc;
              }, {})
            : {};
      })
      .addCase(stdAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export const { setCurrentDate } = stdAttendanceSlice.actions;
export default stdAttendanceSlice.reducer;
