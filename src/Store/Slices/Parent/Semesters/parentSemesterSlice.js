// parentSemester.slice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchSemestersByClass } from "./parentSemester.action";

// Initial state
const initialState = {
  semesters: [],
  selectedSemester: null, // <-- Added this to store the selected semester
  loading: false,
  error: null,
};

// Slice
const parentSemesterSlice = createSlice({
  name: "parentSemester",
  initialState,
  reducers: {
    resetSemesters(state) {
      state.semesters = [];
      state.error = null;
      state.loading = false;
    },
    setSelectedSemester(state, action) {  // <-- Added this function
      state.selectedSemester = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch semesters pending
      .addCase(fetchSemestersByClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Fetch semesters fulfilled
      .addCase(fetchSemestersByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.semesters = action.payload;
      })

      // Fetch semesters rejected
      .addCase(fetchSemestersByClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

// ✅ Export reducer and actions
export const { resetSemesters, setSelectedSemester } = parentSemesterSlice.actions;
export default parentSemesterSlice.reducer;
