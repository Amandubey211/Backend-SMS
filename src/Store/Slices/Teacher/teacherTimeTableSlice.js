import { createSlice } from "@reduxjs/toolkit";
import { fetchTeacherTimetable } from "./teacherTimeTable.action";

const initialState = {
  timetables: [],
  loadingFetch: false,
  errorFetch: null,
};

const teacherTimetableSlice = createSlice({
  name: "teacherTimetable",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherTimetable.pending, (state) => {
        state.loadingFetch = true;
        state.errorFetch = null;
      })
      .addCase(fetchTeacherTimetable.fulfilled, (state, action) => {
        state.loadingFetch = false;
        state.timetables = action.payload; // Update timetable list
      })
      .addCase(fetchTeacherTimetable.rejected, (state, action) => {
        state.loadingFetch = false;
        state.errorFetch = action.payload || "Failed to fetch teacher timetable.";
      });
  },
});

export default teacherTimetableSlice.reducer;
