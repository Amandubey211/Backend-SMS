import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBooksThunk,
  fetchBookIssuesThunk,
  addBookThunk,
  deleteBookThunk,
  issueBookThunk,
  updateBookThunk,
  fetchBooksDetailsThunk,
} from "./LibraryThunks";

const initialState = {
  books: [],
  addbookloading: false,
  bookIssues: [],
  loading: false,
  addBookSuccess: false,
  error: null,
  filters: {
    class: "",
    category: "",
    classLevel: "",
    section: "",
  },
  activeTab: "Library", // Managed tab switching
  isSidebarOpen: false,
  editIssueData: null,
  // New pagination state
  totalBooks: 0,
  totalPages: 0,
  currentPage: 1,
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setFilters(state, action) {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    toggleSidebar(state, action) {
      state.isSidebarOpen = action.payload;
    },
    setEditIssueData(state, action) {
      state.editIssueData = action.payload;
    },
    resetLibraryState(state) {
      state.addBookSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchBooksDetailsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooksDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Update state with pagination response
        state.books = action.payload.books;
        state.totalBooks = action.payload.totalBooks;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchBooksDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ...other reducers remain unchanged
      .addCase(addBookThunk.pending, (state) => {
        state.addbookloading = true;
        state.addBookSuccess = false;
      })
      .addCase(addBookThunk.fulfilled, (state) => {
        state.addbookloading = false;
        state.addBookSuccess = true;
      })
      .addCase(addBookThunk.rejected, (state, action) => {
        state.addbookloading = false;
        state.error = action.payload;
      })
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
      .addCase(issueBookThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(issueBookThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(issueBookThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  setActiveTab,
  toggleSidebar,
  setEditIssueData,
  resetLibraryState,
} = librarySlice.actions;

export default librarySlice.reducer;
