import { createSlice } from "@reduxjs/toolkit";
import { fetchParentTimetable } from "./parentTimeTable.action";

const initialState = {
  timetables: [],
  loading: false,
  error: null,
};

const parentTimeTableSlice = createSlice({
  name: "parentTimetable",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParentTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.timetables = action.payload;
      })
      .addCase(fetchParentTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch parent timetable.";
      });
  },
});

export default parentTimeTableSlice.reducer;
