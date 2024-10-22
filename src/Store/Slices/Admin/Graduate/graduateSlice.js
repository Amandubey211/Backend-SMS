import { createSlice } from "@reduxjs/toolkit";
import { fetchGraduates, demoteStudents } from "./graduate.action"; // Import demoteStudents action

const initialState = {
  graduates: [],
  loading: false,
  error: null,
  total: 0, // Added to store total graduates for pagination
  currentPage: 1,
  totalPages: 1,
  selectedGraduate: null,
  demotionLoading: false,  // New state for handling demotion loading
  demotionError: null,     // New state for handling demotion error
  demotionSuccess: false,  // New state for handling demotion success
};

const graduateSlice = createSlice({
  name: "graduates",
  initialState,
  reducers: {
    setSelectedGraduate: (state, action) => {
      state.selectedGraduate = action.payload;
    },
    clearSelectedGraduate: (state) => {
      state.selectedGraduate = null;
    },
    resetDemotionState: (state) => {
      state.demotionLoading = false;
      state.demotionError = null;
      state.demotionSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Graduates Cases
      .addCase(fetchGraduates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGraduates.fulfilled, (state, action) => {
        state.loading = false;
        state.graduates = action.payload.data;
        state.total = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchGraduates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch graduates";
      })
      
      // Demote Students Cases
      .addCase(demoteStudents.pending, (state) => {
        state.demotionLoading = true;
        state.demotionError = null;
        state.demotionSuccess = false;
      })
      .addCase(demoteStudents.fulfilled, (state) => {
        state.demotionLoading = false;
        state.demotionSuccess = true;
      })
      .addCase(demoteStudents.rejected, (state, action) => {
        state.demotionLoading = false;
        state.demotionError = action.payload || "Failed to demote students";
      });
  },
});

export const { 
  setSelectedGraduate, 
  clearSelectedGraduate, 
  resetDemotionState // Export the new demotion reset action
} = graduateSlice.actions;

export default graduateSlice.reducer;
