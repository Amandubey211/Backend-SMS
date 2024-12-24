import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllClasses,
  createClass,
  updateClass,
  deleteClass,
  fetchClassDetails,
  fetchAllClassesDetails,
} from "../actions/classThunk";

const initialState = {
  classes: [], // List of all classes
  classDetails: null, // Specific class details for a selected class
  loading: false, // Loading state for fetching data
  error: null, // Error state
};

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    // Action to set the class details
    setClass(state, action) {
      state.classDetails = action.payload;
    },
    // Optionally, we can also add a reset action for clearing the state when needed
    resetClassDetails(state) {
      state.classDetails = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all classes lifecycle
    builder
      .addCase(fetchAllClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchAllClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      
      builder
      .addCase(fetchAllClassesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllClassesDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchAllClassesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch specific class details lifecycle
    builder
      .addCase(fetchClassDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.classDetails = action.payload; // Set the class details in the state
      })
      .addCase(fetchClassDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create class lifecycle
    builder
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state) => {
        state.loading = false;
        // No need to manually add the created class; refetching the list will update the classes
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update class lifecycle
    builder
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state) => {
        state.loading = false;
        // No need to manually update the class details, we will refetch the list after updates
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete class lifecycle
    builder
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        // No need to manually remove the class; refetching the list will handle updates
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setClass, resetClassDetails } = classSlice.actions; // Export actions to set/reset class details
export default classSlice.reducer;
