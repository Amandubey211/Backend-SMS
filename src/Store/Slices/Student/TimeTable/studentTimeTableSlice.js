import { createSlice } from "@reduxjs/toolkit";
import { fetchStudentTimetable } from "./studentTimeTable.action";

const initialState = {
  timetables: [],
  loading: false,
  error: null,
};

const studentTimeTableSlice = createSlice({
  name: "studentTimetable",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.timetables = action.payload;
      })
      .addCase(fetchStudentTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch student timetable.";
      });
  },
});

export default studentTimeTableSlice.reducer;
