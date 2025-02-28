import { createSlice } from "@reduxjs/toolkit";
import { fetchLibraryBooks } from "./library.action";

const initialState = {
  books: [], // Store raw data
  loading: false,
  error: null,
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibraryBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLibraryBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload?.books || []; // Store raw books array
      })
      .addCase(fetchLibraryBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch library books";
      });
  },
});

export default librarySlice.reducer;
