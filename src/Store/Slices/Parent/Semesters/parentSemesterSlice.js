// parentSemester.slice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchSemestersByClass } from "./parentSemester.action";

const initialState = {
  semesters: [],
  selectedSemester: null,
  loading: false,
  error: null,
};

const parentSemesterSlice = createSlice({
  name: "parentSemester",
  initialState,
  reducers: {
    resetSemesters(state) {
      state.semesters = [];
      state.error = null;
      state.loading = false;
    },
    setSelectedSemester(state, action) {
      state.selectedSemester = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSemestersByClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSemestersByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.semesters = action.payload || []; // Safely set array
      })
      .addCase(fetchSemestersByClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetSemesters, setSelectedSemester } = parentSemesterSlice.actions;
export default parentSemesterSlice.reducer;
