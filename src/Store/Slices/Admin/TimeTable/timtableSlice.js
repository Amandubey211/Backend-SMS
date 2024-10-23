import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTimetables,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} from "./timetable.action";

const initialState = {
  timetables: [],
  loadingFetch: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
  errorFetch: null,
  errorCreate: null,
  errorUpdate: null,
  errorDelete: null,
};

const timetableSlice = createSlice({
  name: "timetable",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Timetables
    builder
      .addCase(fetchTimetables.pending, (state) => {
        state.loadingFetch = true;
        state.errorFetch = null;
      })
      .addCase(fetchTimetables.fulfilled, (state, action) => {
        state.loadingFetch = false;
        state.timetables = action.payload; // Set timetables to the response data
      })
      .addCase(fetchTimetables.rejected, (state, action) => {
        state.loadingFetch = false;
        state.errorFetch = action.payload || "Failed to fetch timetables.";
      });

    // Create Timetable
    builder
      .addCase(createTimetable.pending, (state) => {
        state.loadingCreate = true;
        state.errorCreate = null;
      })
      .addCase(createTimetable.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.timetables.push(action.payload); // Add the newly created timetable
      })
      .addCase(createTimetable.rejected, (state, action) => {
        state.loadingCreate = false;
        state.errorCreate = action.payload || "Failed to create timetable.";
      });

    // Update Timetable
    builder
      .addCase(updateTimetable.pending, (state) => {
        state.loadingUpdate = true;
        state.errorUpdate = null;
      })
      .addCase(updateTimetable.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        state.timetables = state.timetables.map((timetable) =>
          timetable._id === action.payload._id ? action.payload : timetable
        );
      })
      .addCase(updateTimetable.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.errorUpdate = action.payload || "Failed to update timetable.";
      });

    // Delete Timetable
    builder
      .addCase(deleteTimetable.pending, (state) => {
        state.loadingDelete = true;
        state.errorDelete = null;
      })
      .addCase(deleteTimetable.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.timetables = state.timetables.filter(
          (timetable) => timetable._id !== action.payload.id
        );
      })
      .addCase(deleteTimetable.rejected, (state, action) => {
        state.loadingDelete = false;
        state.errorDelete = action.payload || "Failed to delete timetable.";
      });
  },
});

export default timetableSlice.reducer;
