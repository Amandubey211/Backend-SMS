import { createSlice } from "@reduxjs/toolkit";
import {
  createTimetable,
  deleteTimetable,
  fetchTimetableList,
  updateTimetable,
} from "./timetable.action";

const initialState = {
  timetables: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
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
    // ----------------------------
    // 1) FETCH Timetables
    // ----------------------------
    builder
      .addCase(fetchTimetableList.pending, (state) => {
        state.loadingFetch = true;
        state.errorFetch = null;
      })
      .addCase(fetchTimetableList.fulfilled, (state, action) => {
        state.loadingFetch = false;

        // The thunk now returns the full response: { success, data, pagination }
        // If you only returned the data array before, adjust accordingly
        const { data = [], pagination = {} } = action.payload || {};
        state.timetables = data;
        // If pagination is present, store it
        if (pagination.total !== undefined) {
          state.pagination = pagination;
        }
      })
      .addCase(fetchTimetableList.rejected, (state, action) => {
        state.loadingFetch = false;
        state.errorFetch = action.payload || "Failed to fetch timetables.";
      });

    // ----------------------------
    // 2) CREATE Timetable
    // ----------------------------
    builder
      .addCase(createTimetable.pending, (state) => {
        state.loadingCreate = true;
        state.errorCreate = null;
      })
      .addCase(createTimetable.fulfilled, (state, action) => {
        state.loadingCreate = false;
        // If your API returns { success, data }:
        if (action.payload?.data) {
          state.timetables.push(action.payload.data);
        }
      })
      .addCase(createTimetable.rejected, (state, action) => {
        state.loadingCreate = false;
        state.errorCreate = action.payload || "Failed to create timetable.";
      });

    // ----------------------------
    // 3) UPDATE Timetable
    // ----------------------------
    builder
      .addCase(updateTimetable.pending, (state) => {
        state.loadingUpdate = true;
        state.errorUpdate = null;
      })
      .addCase(updateTimetable.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        // Optional: if the API returns the updated timetable, patch it in the array
        // const updated = action.payload?.data;
        // if (updated?._id) {
        //   const idx = state.timetables.findIndex(tt => tt._id === updated._id);
        //   if (idx >= 0) state.timetables[idx] = updated;
        // }
      })
      .addCase(updateTimetable.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.errorUpdate = action.payload || "Failed to update timetable.";
      });

    // ----------------------------
    // 4) DELETE Timetable
    // ----------------------------
    builder
      .addCase(deleteTimetable.pending, (state) => {
        state.loadingDelete = true;
        state.errorDelete = null;
      })
      .addCase(deleteTimetable.fulfilled, (state, action) => {
        state.loadingDelete = false;
        // If your delete thunk returns { success, id }:
        const { id } = action.payload;
        state.timetables = state.timetables.filter((tt) => tt._id !== id);
      })
      .addCase(deleteTimetable.rejected, (state, action) => {
        state.loadingDelete = false;
        state.errorDelete = action.payload || "Failed to delete timetable.";
      });
  },
});

export default timetableSlice.reducer;
