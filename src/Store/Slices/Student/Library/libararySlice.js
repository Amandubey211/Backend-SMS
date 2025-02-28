import { createSlice } from "@reduxjs/toolkit";
import { libraryBooksStudent } from "./libarary.action";

const initialState = {
  loading: false,
  error: false,
  libararyBooks: [],
  totalBooks: 0,
  totalPages: 0,
  currentPage: 1,
  activeTab: "Library",
  searchQuery: "",
  category: "",
};

const stdLibrarySlice = createSlice({
  name: "studentLibrary",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(libraryBooksStudent.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(libraryBooksStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.libararyBooks = action.payload?.books || [];
        state.totalPages = action.payload?.totalPages || 1;
        state.currentPage = action.payload?.currentPage || 1;
      })
      .addCase(libraryBooksStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export const {
  setFilters,
  setActiveTab,
  setCurrentPage,
  setSearchQuery,
  setCategory,
} = stdLibrarySlice.actions;
export default stdLibrarySlice.reducer;
