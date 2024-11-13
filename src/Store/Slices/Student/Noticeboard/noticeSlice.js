import { createSlice } from "@reduxjs/toolkit";
import { studentNotice } from "./notice.action";

const initialState = {
  loading: false,
  error: false,
  noticeData: [],
  searchTerm: "",
  activeIndex: null,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(studentNotice.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(studentNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.noticeData = action.payload;
      })
      .addCase(studentNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export const { setActiveIndex, setSearchTerm } = stdNoticeSlice.actions;
export default stdNoticeSlice.reducer;
