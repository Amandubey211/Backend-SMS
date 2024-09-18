import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllClasses,
  createClass,
  updateClass,
  deleteClass,
} from "../actions/classThunk";

const initialState = {
  classes: [],
  loading: false,
  error: null,
  lastFetched: null,
};

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {},
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
        state.lastFetched = Date.now();
      })
      .addCase(fetchAllClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create class lifecycle
    builder
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes.push(action.payload); // Add newly created class to the list
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update class lifecycle
    builder.addCase(updateClass.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload,"payload");
        const index = state.classes.findIndex(
          (cls) => cls._id === action.payload.classId
        );
        if (index !== -1) {
          console.log("Updating class at index:", index); // Log the index being updated
          console.log("Old class data:", state.classes[index]); // Log old data
          state.classes[index] = { ...state.classes[index], ...action.payload }; // Merge updated data
          console.log("Updated class data:", state.classes[index]); // Log updated data
        }
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
        state.classes = state.classes.filter(
          (cls) => cls._id !== action.payload
        );
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default classSlice.reducer;
