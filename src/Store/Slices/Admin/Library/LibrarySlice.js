// src/Store/Slices/Admin/Library/LibrarySlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBooksThunk,
  fetchBookIssuesThunk,
  addBookThunk,
  deleteBookThunk,
  issueBookThunk,
  updateBookThunk,
} from "./LibraryThunks";

const initialState = {
  books: [],
  addbookloading: false,
  bookIssues: [],
  classList: [],
  sectionList: [],
  studentList: [],
  loading: false,
  error: null,
  filters: {
    class: "",
    category: "",
  },
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    // Update filters for filtering books
    setFilters(state, action) {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooksThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Book
      .addCase(addBookThunk.pending, (state) => {
        state.addbookloading = true;
      })
      .addCase(addBookThunk.fulfilled, (state, action) => {
        state.addbookloading = false;
        // state.books.push(action.payload);
      })
      .addCase(addBookThunk.rejected, (state, action) => {
        state.addbookloading = false;
        state.error = action.payload;
      })
      // Delete Book
      .addCase(deleteBookThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBookThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter((book) => book._id !== action.payload);
      })
      .addCase(deleteBookThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Book
      .addCase(updateBookThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBookThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.books.findIndex(
          (book) => book._id === action.payload._id
        );
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(updateBookThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Book Issues
      .addCase(fetchBookIssuesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookIssuesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.bookIssues = action.payload;
      })
      .addCase(fetchBookIssuesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Issue Book
      .addCase(issueBookThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(issueBookThunk.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.bookIssues.findIndex(
          (issue) => issue._id === action.payload._id
        );
        if (existingIndex >= 0) {
          state.bookIssues[existingIndex] = action.payload;
        } else {
          state.bookIssues.push(action.payload);
        }
      })
      .addCase(issueBookThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters } = librarySlice.actions;

export default librarySlice.reducer;
