// semesterSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSemestersByClass,
  createSemester,
  updateSemester,
  deleteSemester,
} from "./semesterThunks";

const semesterSlice = createSlice({
  name: "semesters",
  initialState: {
    semesters: [],
    semester: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Reset semester state (if needed in your UI)
    resetSemester: (state) => {
      state.semester = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Semesters ---
      .addCase(fetchSemestersByClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSemestersByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.semesters = action.payload;
      })
      .addCase(fetchSemestersByClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Create Semester ---
      .addCase(createSemester.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSemester.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally add the new semester to the state array
        // state.semesters.push(action.payload.data);
      })
      .addCase(createSemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Update Semester ---
      .addCase(updateSemester.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSemester.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateSemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Delete Semester ---
      .addCase(deleteSemester.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSemester.fulfilled, (state, action) => {
        state.loading = false;
        state.semesters = state.semesters.filter(
          (sem) => sem._id !== action.payload
        );
      })
      .addCase(deleteSemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSemester } = semesterSlice.actions;
export default semesterSlice.reducer;
