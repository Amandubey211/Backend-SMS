import { createSlice } from "@reduxjs/toolkit";
import { fetchStudentTimetable } from "./studentTimeTable.action";

const initialState = {
   timetables: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  counts: {},
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
             const {
          data = [],
          pagination = {},
          counts = {},
        } = action.payload || {};
        state.timetables = data;
        state.counts = counts;

        // If pagination is present, store it
        if (pagination.total !== undefined) {
          state.pagination = pagination;
        }
      })
      .addCase(fetchStudentTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch student timetable.";
      });
  },
});

export default studentTimeTableSlice.reducer;
