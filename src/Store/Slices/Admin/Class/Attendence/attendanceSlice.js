import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAttendanceByClassSectionGroupDate,
  markAttendance,
} from "./attendanceThunks";

const initialState = {
  attendanceData: [],
  stats: {},
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearAttendanceState: (state) => {
      state.attendanceData = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceByClassSectionGroupDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAttendanceByClassSectionGroupDate.fulfilled,
        (state, action) => {
          state.loading = false;
          state.attendanceData = action.payload.attendanceList || [];
          state.stats = action.payload.attendanceStats || {};
        }
      )
      .addCase(
        fetchAttendanceByClassSectionGroupDate.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAttendanceState } = attendanceSlice.actions;

export default attendanceSlice.reducer;
