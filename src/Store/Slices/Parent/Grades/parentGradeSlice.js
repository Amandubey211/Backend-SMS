// Store/Slices/Parent/Grades/parentGradeSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchParentStudentGrades } from "./parentGrade.action";

const initialState = {
  grades: {},
  loading: false,
  error: null,
};

const parentGradeSlice = createSlice({
  name: "parentGrades",
  initialState,
  reducers: {
    resetGrades(state) {
      state.grades = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentStudentGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParentStudentGrades.fulfilled, (state, action) => {
        state.loading = false;
        state.grades = action.payload.data || {}; // Store grades in state
      })
      .addCase(fetchParentStudentGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch grades.";
      });
  },
});

export const { resetGrades } = parentGradeSlice.actions;
export default parentGradeSlice.reducer;
