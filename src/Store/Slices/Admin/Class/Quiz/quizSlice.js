import { createSlice } from "@reduxjs/toolkit";
import { fetchFilteredQuizzesThunk, fetchQuizByIdThunk } from "./quizThunks"; // Import thunks

const initialState = {
  loading: false,
  quizzes: [],
  error: null,
  success: false,
  quizzDetail: null, // For holding quiz detail fetched by ID
};

const quizSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Filtered Quizzes
      .addCase(fetchFilteredQuizzesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredQuizzesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchFilteredQuizzesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Quiz by ID
      .addCase(fetchQuizByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzDetail = action.payload; // Store the fetched quiz
      })
      .addCase(fetchQuizByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = quizSlice.actions;

export default quizSlice.reducer;
