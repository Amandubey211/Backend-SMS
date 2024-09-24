import { createSlice } from '@reduxjs/toolkit';
import { fetchLibraryBooks } from './libraryThunks';

const initialState = {
  books: [],
  loading: false,
  error: null,
};

const librarySlice = createSlice({
  name: 'library',
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
        state.books = action.payload;
      })
      .addCase(fetchLibraryBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default librarySlice.reducer;
