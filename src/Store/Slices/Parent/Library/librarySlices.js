import { createSlice } from '@reduxjs/toolkit';
import { fetchLibraryBooks } from './library.action';

const initialState = {
  books: [],
  loading: false,
  error: false,
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibraryBooks.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchLibraryBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchLibraryBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default librarySlice.reducer;
