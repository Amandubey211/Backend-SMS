import { createSlice } from "@reduxjs/toolkit";
import {
  createTimetable,
  deleteTimetable,
  fetchTimetableList,
  updateTimetable,
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
    // -------------------------------------------
    // 1) FETCH Timetables
    // -------------------------------------------
    builder
      .addCase(fetchTimetableList.pending, (state) => {
        state.loadingFetch = true;
        state.errorFetch = null;
      })
      .addCase(fetchTimetableList.fulfilled, (state, action) => {
        state.loadingFetch = false;
        state.timetables = action.payload || [];
      })
      .addCase(fetchTimetableList.rejected, (state, action) => {
        state.loadingFetch = false;
        state.errorFetch = action.payload || "Failed to fetch timetables.";
      });

    // -------------------------------------------
    // 2) CREATE Timetable
    // -------------------------------------------
    builder
      .addCase(createTimetable.pending, (state) => {
        state.loadingCreate = true;
        state.errorCreate = null;
      })
      .addCase(createTimetable.fulfilled, (state, action) => {
        state.loadingCreate = false;
        // Append the newly created timetable to the list
        if (action.payload?.data) {
          // If your API returns { success, message, data } destructure accordingly
          state.timetables.push(action.payload.data);
        } else {
          // Otherwise, if it returns the timetable object directly
          state.timetables.push(action.payload);
        }
      })
      .addCase(createTimetable.rejected, (state, action) => {
        state.loadingCreate = false;
        state.errorCreate = action.payload || "Failed to create timetable.";
      });

    // -------------------------------------------
    // 3) UPDATE Timetable
    // -------------------------------------------
    builder
      .addCase(updateTimetable.pending, (state) => {
        state.loadingUpdate = true;
        state.errorUpdate = null;
      })
      .addCase(updateTimetable.fulfilled, (state, action) => {
        state.loadingUpdate = false;

        // const updated = action.payload?.data || action.payload;
        // // Find the index of the updated timetable
        // const idx = state.timetables.findIndex((tt) => tt._id === updated._id);
        // if (idx !== -1) {
        //   state.timetables[idx] = updated;
        // }
      })
      .addCase(updateTimetable.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.errorUpdate = action.payload || "Failed to update timetable.";
      });

    // -------------------------------------------
    // 4) DELETE Timetable
    // -------------------------------------------
    builder
      .addCase(deleteTimetable.pending, (state) => {
        state.loadingDelete = true;
        state.errorDelete = null;
      })
      .addCase(deleteTimetable.fulfilled, (state, action) => {
        state.loadingDelete = false;
        const { id } = action.payload; // ID of the deleted timetable
        state.timetables = state.timetables.filter((tt) => tt._id !== id);
      })
      .addCase(deleteTimetable.rejected, (state, action) => {
        state.loadingDelete = false;
        state.errorDelete = action.payload || "Failed to delete timetable.";
      });
  },
});

export default timetableSlice.reducer;
