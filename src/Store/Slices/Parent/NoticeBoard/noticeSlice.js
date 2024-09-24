import { createSlice } from "@reduxjs/toolkit";
import { fetchAllNotices } from "./noticeThunks"; // Import the thunk from noticeThunks

// Notice slice
const noticeSlice = createSlice({
  name: "notice",
  initialState: {
    notices: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload;
      })
      .addCase(fetchAllNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default noticeSlice.reducer;
