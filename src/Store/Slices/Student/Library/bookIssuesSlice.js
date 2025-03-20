import { createSlice } from "@reduxjs/toolkit";
import { studentIssueBooks } from "./bookIssues.action";

const initialState = {
  loading: false,
  error: false,
  issueBooks: [],
  filters: {
    classLevel: "",
    category: "",
    status: "All",
  },
  currentIssuedBookPage: 1,
  totalIssueBookPages: 0,
  totalIssuedBook: 0,
};
const stdIssueBooksslice = createSlice({
  name: "studentIssueBooks",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(studentIssueBooks.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(studentIssueBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.issueBooks = action.payload?.issuedBooks;
        state.totalIssuedBook= action?.totalIssuedBooks || 0;
        state.totalIssueBookPages = action?.totalPages || 1;
        state.currentIssuedBookPage = action?.currentPage || 1; 
      })
      .addCase(studentIssueBooks.rejected, (state, action) => {
        state.loading = false;
        // console.log("gyugyugyug", action.payload);
        state.error = action.payload || true;
      });
  },
});

export const { setFilters } = stdIssueBooksslice.actions;
export default stdIssueBooksslice.reducer;
