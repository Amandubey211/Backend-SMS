import { createSlice } from "@reduxjs/toolkit";
import { fetchParentTimetable,fetchAscTimetable } from "./parentTimeTable.action";

const initialState = {
  timetables: [],
  ascTimeTable:{},
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
    builder
      .addCase(fetchAscTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAscTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.ascTimeTable = action.payload;
      })
      .addCase(fetchAscTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch parent timetable.";
      });
  },
});

export default parentTimeTableSlice.reducer;
