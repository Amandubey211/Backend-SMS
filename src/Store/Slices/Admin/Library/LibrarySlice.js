// Store/Slices/Admin/Library/LibrarySlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBooksThunk,
  fetchBooksDetailsThunk,
  addBookThunk,
  deleteBookThunk,
  updateBookThunk,
  fetchBookIssuesThunk,
  issueBookThunk,
  // CATEGORY thunks
  fetchCategoriesThunk,
  addCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
  // NEW 👉 ISBN lookup thunk
  fetchBookByISBNThunk,
  validateIssuedBookThunk,
} from "./LibraryThunks";

/* ------------------------------------------------------------------ */
/* STATE                                                              */
/* ------------------------------------------------------------------ */
const initialState = {
  /* BOOKS */
  books: [],
  bookIssues: [],
  loading: false,
  addbookloading: false,
  addBookSuccess: false,
  error: null,

  /* BARCODE / ISBN LOOKUP */
  isbnLoading: false, // 🔍 <-- added
  isbnBookData: null, // 🔍 <-- added

  /* FILTERS */
  filters: { class: "", category: "", classLevel: "", section: "" },

  /* UI STATE */
  activeTab: "Library",
  isSidebarOpen: false,
  editIssueData: null,

  /* PAGINATION */
  totalBooks: 0,
  totalPages: 0,
  currentPage: 1,

  /* CATEGORIES */
  categories: [],
  categoriesLoading: false,
  categoryError: null,
  addCategorySuccess: false,
  updateCategorySuccess: false,
  deleteCategorySuccess: false,
  validateLoading: false,
  validateSuccess: false,
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setFilters(state, { payload: { key, value } }) {
      state.filters[key] = value;
    },
    setActiveTab(state, { payload }) {
      state.activeTab = payload;
    },
    toggleSidebar(state, { payload }) {
      state.isSidebarOpen = payload;
    },
    setEditIssueData(state, { payload }) {
      state.editIssueData = payload;
    },
    resetLibraryState(state) {
      state.addBookSuccess = false;
      state.addCategorySuccess = false;
      state.updateCategorySuccess = false;
      state.deleteCategorySuccess = false;
      /* NEW 👉 clear ISBN lookup cache when drawer resets */
      state.isbnLoading = false;
      state.isbnBookData = null;
    },
    setCurrentPage(state, { payload }) {
      state.currentPage = payload;
    },
  },
  extraReducers: (builder) => {
    // ----------------- BOOKS ------------------
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

      // Detailed Books (with pagination)
      .addCase(fetchBooksDetailsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooksDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload?.books || [];
        state.totalBooks = action.payload?.totalBooks;
        state.totalPages = action.payload?.totalPages;
        state.currentPage = action.payload?.currentPage;
      })
      .addCase(fetchBooksDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD BOOK
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

      // DELETE BOOK
      .addCase(deleteBookThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBookThunk.fulfilled, (state, action) => {
        state.loading = false;
        // state.books = state.books.filter((book) => book._id !== action.payload);
      })
      .addCase(deleteBookThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE BOOK
      .addCase(updateBookThunk.pending, (state) => {
        state.addbookloading = true;
      })
      .addCase(updateBookThunk.fulfilled, (state, action) => {
        state.addbookloading = false;
      })
      .addCase(updateBookThunk.rejected, (state, action) => {
        state.addbookloading = false;
        state.error = action.payload;
      })

      // ----------------- BOOK ISSUES ------------------
      .addCase(fetchBookIssuesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookIssuesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.bookIssues = action.payload.issues;
        state.totalBooks = action.payload.pagination.totalItems;
        state.totalPages = action.payload.pagination.totalPages;
        state.currentPage = action.payload.pagination.currentPage;
      })
      .addCase(fetchBookIssuesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ISSUE BOOK
      .addCase(issueBookThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(issueBookThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(issueBookThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----------------- CATEGORIES ------------------
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.categoriesLoading = true;
        state.categoryError = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoryError = action.payload;
      })

      // ADD CATEGORY
      .addCase(addCategoryThunk.pending, (state) => {
        state.categoriesLoading = true;
        state.addCategorySuccess = false;
      })
      .addCase(addCategoryThunk.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.addCategorySuccess = true;
        // Add the new category to the store
        state.categories.push(action.payload || {});
      })
      .addCase(addCategoryThunk.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoryError = action.payload;
      })

      // UPDATE CATEGORY
      .addCase(updateCategoryThunk.pending, (state) => {
        state.categoriesLoading = true;
        state.updateCategorySuccess = false;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.updateCategorySuccess = true;
        const updatedCat = action.payload;
        const idx = state.categories.findIndex(
          (cat) => cat._id === updatedCat._id
        );
        if (idx !== -1) {
          state.categories[idx] = updatedCat;
        }
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoryError = action.payload;
      })

      // DELETE CATEGORY
      .addCase(deleteCategoryThunk.pending, (state) => {
        state.categoriesLoading = true;
        state.deleteCategorySuccess = false;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.deleteCategorySuccess = true;
        const deletedId = action.payload;
        state.categories = state.categories.filter(
          (cat) => cat._id !== deletedId
        );
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoryError = action.payload;
      })

      .addCase(fetchBookByISBNThunk.pending, (state) => {
        state.isbnLoading = true;
        state.isbnBookData = null;
      })
      .addCase(fetchBookByISBNThunk.fulfilled, (state, { payload }) => {
        state.isbnLoading = false;
        state.isbnBookData = payload; // <-- BookForm consumes this
      })
      .addCase(fetchBookByISBNThunk.rejected, (state, { payload }) => {
        state.isbnLoading = false;
        state.error = payload;
      })
      .addCase(validateIssuedBookThunk.pending, (s) => {
        s.validateLoading = true;
        s.validateSuccess = false;
      })
      .addCase(validateIssuedBookThunk.fulfilled, (s) => {
        s.validateLoading = false;
        s.validateSuccess = true;
      })
      .addCase(validateIssuedBookThunk.rejected, (s) => {
        s.validateLoading = false;
        s.validateSuccess = false;
      });
  },
});

export const {
  setFilters,
  setActiveTab,
  toggleSidebar,
  setEditIssueData,
  resetLibraryState,
  setCurrentPage,
} = librarySlice.actions;

export default librarySlice.reducer;
