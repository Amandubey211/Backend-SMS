import { createSlice } from "@reduxjs/toolkit";
import { fetchSemestersByClass } from "./semesterThunks";

const studentSemesterSlice = createSlice({
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
      });
  },
});

export const { resetSemester } = studentSemesterSlice.actions;
export default studentSemesterSlice.reducer;
