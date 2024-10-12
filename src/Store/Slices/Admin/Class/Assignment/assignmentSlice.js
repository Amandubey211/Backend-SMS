import { createSlice } from "@reduxjs/toolkit";
import {
  createAssignmentThunk,
  updateAssignmentThunk,
  fetchAssignmentsByClassThunk,
  deleteAssignmentThunk,
  fetchFilteredAssignments,
} from "./assignmentThunks"; // Import thunks

// Initial state for the assignment slice
const initialState = {
  loading: false,
  assignments: [], // List of assignments
  error: null, // Error state
  success: false, // Success state for form submissions
  assignmentDetails: null, // Specific assignment details for editing
};

// Assignment slice with reducers and extra reducers for async actions
const assignmentSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = false;
    },
    setAssignmentDetails(state, action) {
      state.assignmentDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle assignment creation
    builder
      .addCase(createAssignmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAssignmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.assignments.push(action.payload);
      })
      .addCase(createAssignmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create assignment";
      });

    // Handle assignment update
    builder
      .addCase(updateAssignmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAssignmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.assignments.findIndex(
          (assignment) => assignment._id === action.payload._id
        );
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
      })
      .addCase(updateAssignmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update assignment";
      });

    // Handle fetching assignments by class
    builder
      .addCase(fetchAssignmentsByClassThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentsByClassThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignmentsByClassThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch assignments";
      });

    // Handle assignment deletion
    builder
      .addCase(deleteAssignmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssignmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.filter(
          (assignment) => assignment._id !== action.payload
        );
      })
      .addCase(deleteAssignmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete assignment";
      });

    // Handle fetching filtered assignments
    builder
      .addCase(fetchFilteredAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchFilteredAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch filtered assignments";
      });
  },
});

// Export actions and reducer
export const { clearError, clearSuccess, setAssignmentDetails } =
  assignmentSlice.actions;

export default assignmentSlice.reducer;
