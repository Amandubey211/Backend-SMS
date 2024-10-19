import { createSlice } from "@reduxjs/toolkit";
import {
  stdGetAssignment,
  stdDoAssignment,
  stdReattemptAssignment,
  stdGetFilteredAssignment,
} from "./assignment.action";

// Initial State
const initialState = {
  loading: false,
  error: null,
  assignmentData: null,
  submissionData: null,
  filteredAssignments: [],
  showError: false, // Added for handling the showError state
};

// Slice Definition
const assignmentSlice = createSlice({
  name: "studentAssignment",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAssignments: (state) => {
      state.assignmentData = null;
      state.submissionData = null;
      state.filteredAssignments = [];
    },
    setShowError: (state, action) => {
      state.showError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get assignment details
      .addCase(stdGetAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(stdGetAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignmentData = action.payload.assignment;
        state.submissionData = action.payload.submission;
      })
      .addCase(stdGetAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit assignment
      .addCase(stdDoAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(stdDoAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.submissionData = action.payload;
      })
      .addCase(stdDoAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reattempt assignment
      .addCase(stdReattemptAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(stdReattemptAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.submissionData = action.payload;
      })
      .addCase(stdReattemptAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch filtered assignments
      .addCase(stdGetFilteredAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(stdGetFilteredAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredAssignments = action.payload;
      })
      .addCase(stdGetFilteredAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAssignments, setShowError } =
  assignmentSlice.actions;
export default assignmentSlice.reducer;
