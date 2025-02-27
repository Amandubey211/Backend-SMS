import { createSlice } from "@reduxjs/toolkit";
import { fetchLibraryBooks } from "./library.action";

const initialState = {
  books: [],
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
        state.books = action.payload?.books?.map((book) => ({
          id: book._id,
          studentName: book.studentId ? `${book.studentId.firstName} ${book.studentId.lastName}` : "Unknown",
          studentProfile: book.studentId?.profile || "",
          bookName: book.bookId?.name || "Unknown Book",
          bookCategory: book.bookId?.category || "Unknown Category",
          author: book.bookId?.author || "Unknown Author",
          issueDate: book.issueDate ? new Date(book.issueDate).toLocaleDateString() : "N/A",
          returnDate: book.returnDate ? new Date(book.returnDate).toLocaleDateString() : "N/A",
          status: book.status || "Unknown",
        })) || [];
      })
      .addCase(fetchLibraryBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch library books";
      });
  },
});

export default librarySlice.reducer;
