import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSyllabus,
  deleteSyllabus,
  createSyllabus,
  editSyllabus,
} from "./syllabusThunk";

const initialState = {
  syllabi: [],
  loading: false,
  error: null,
};

const syllabusSlice = createSlice({
  name: "syllabus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Syllabus
      .addCase(fetchSyllabus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSyllabus.fulfilled, (state, action) => {
        state.loading = false;
        state.syllabi = action.payload;
      })
      .addCase(fetchSyllabus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Syllabus
      .addCase(deleteSyllabus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSyllabus.fulfilled, (state, action) => {
        state.loading = false;
        state.syllabi = state.syllabi.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSyllabus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Syllabus
      .addCase(createSyllabus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSyllabus.fulfilled, (state, action) => {
        state.loading = false;
        state.syllabi.push(action.payload);
      })
      .addCase(createSyllabus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit Syllabus
      .addCase(editSyllabus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editSyllabus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.syllabi.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) {
          state.syllabi[index] = action.payload;
        }
      })
      .addCase(editSyllabus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default syllabusSlice.reducer;
