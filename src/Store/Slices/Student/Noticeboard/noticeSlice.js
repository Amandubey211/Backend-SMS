import { createSlice } from "@reduxjs/toolkit";
import { studentNotice } from "./notice.action";

const initialState = {
  loading: false,
  error: false,
  noticeData: [],
  searchTerm: "",
  activeIndex: null,
  totalNotices: 0,
  totalPages: 0,
  currentPage: 1,
  priority: "",
};

const stdNoticeSlice = createSlice({
  name: "studentNotice",
  initialState,
  reducers: {
    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
      // Optionally reset other state related to filters if needed
    },
    setPriority: (state, action) => {
      state.priority = action.payload;
      state.currentPage = 1;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(studentNotice.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(studentNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.noticeData = action.payload.notices || [];
        state.totalNotices = action.payload.totalNotices || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(studentNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export const {
  setActiveIndex,
  setSearchTerm,
  setCurrentPage,
  setPriority
} = stdNoticeSlice.actions;
export default stdNoticeSlice.reducer;
