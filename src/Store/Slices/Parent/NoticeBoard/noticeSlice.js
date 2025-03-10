import { createSlice } from "@reduxjs/toolkit";
import { fetchAllNotices } from "./notice.action";

// Notice slice
const noticeSlice = createSlice({
  name: "notice",
  initialState: {
    notices: [],
    loading: false,
    error: false,
    currentPage: 1,
    totalPages: 1,
    totalNotices: 0,
  },
  reducers: {
 
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNotices.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchAllNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload?.notices;
        state.currentPage = action.payload?.currentPage;
        state.totalPages = action.payload?.totalPages;
        state.totalNotices = action.payload?.totalNotices;
      })
      .addCase(fetchAllNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {  } = noticeSlice.actions;
export default noticeSlice.reducer;
