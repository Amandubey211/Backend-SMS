// src/Store/Slices/Student/MyClass/Class/Attendance/stdAttendanceSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { stdAttendance } from "./stdAttendance.action";

const initialState = {
  loading: false,
  error: false,
  attendanceData: {}, // { "YYYY-MM-DD": "present/absent/leave" }
  summary: {
    presentCount: 0,
    absentCount: 0,
    leaveCount: 0,
  },
};

const stdAttendanceSlice = createSlice({
  name: "studentAttendance",
  initialState,
  reducers: {
    // No local year/month or currentDate needed now
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

        // The backend returns { summary, report }.
        // "report" is an array of { date: "YYYY-MM-DD", status: "present" | "absent" | "leave" }.
        const { summary, report } = action.payload || {};

        // Update summary
        state.summary = summary || {
          presentCount: 0,
          absentCount: 0,
          leaveCount: 0,
        };

        // Convert "report" array to object: { "2024-01-05": "present", ... }
        if (Array.isArray(report)) {
          state.attendanceData = report.reduce((acc, entry) => {
            if (entry?.date && entry?.status) {
              acc[entry.date] = entry.status;
            }
            return acc;
          }, {});
        } else {
          state.attendanceData = {};
        }
      })
      .addCase(stdAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export default stdAttendanceSlice.reducer;
