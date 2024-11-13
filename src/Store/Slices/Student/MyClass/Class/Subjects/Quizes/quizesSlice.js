// Import necessary functions from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";
import {
  stdGetQuiz,
  stdGetSingleQuiz,
  submitQuiz,
  fetchAttemptHistory,
  fetchAllAttemptHistory,
  startQuiz,
  updateRemainingTime,
} from "./quizes.action";

// Initial state
const initialState = {
  loading: false,
  error: false,
  // Quizzes List
  quizData: [],
  searchQuery: "",
  // Quiz page
  itemDetails: {},
  activeTab: "instructions",
  selectedOptions: {},
  // Quiz questions
  currentQuestionIndex: 0,
  // Attempt history
  attemptHistory: [],
  selectedAttempt: null,
  // Submit quiz
  quizResults: {
    totalPoints: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  },
  // Timer
  timeLeft: 0, // in seconds
  totalTime: 0, // in seconds
};

const stdQuizSlice = createSlice({
  name: "studentQuiz",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSelectedOptions: (state, action) => {
      state.selectedOptions = action.payload;
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    setSelectedAttempt: (state, action) => {
      state.selectedAttempt = action.payload;
    },
    setQuizResults: (state, action) => {
      state.quizResults = action.payload;
    },
    setAttemptHistory: (state, action) => {
      state.attemptHistory = action.payload;
    },
    setTimeLeft: (state, action) => {
      state.timeLeft = action.payload;
    },
    setTotalTime: (state, action) => {
      state.totalTime = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle stdGetQuiz
      .addCase(stdGetQuiz.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(stdGetQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizData = action.payload;
      })
      .addCase(stdGetQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Handle stdGetSingleQuiz
      .addCase(stdGetSingleQuiz.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(stdGetSingleQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.itemDetails = action.payload;
      })
      .addCase(stdGetSingleQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Handle submitQuiz
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.loading = false;
        // The quizResults and attemptHistory are updated in the action itself
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Handle fetchAttemptHistory
      .addCase(fetchAttemptHistory.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchAttemptHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.attemptHistory = action.payload;
      })
      .addCase(fetchAttemptHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Handle fetchAllAttemptHistory
      .addCase(fetchAllAttemptHistory.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchAllAttemptHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.attemptHistory = action.payload?.length ? action.payload : [];
      })
      .addCase(fetchAllAttemptHistory.rejected, (state, action) => {
        state.loading = false;
        state.attemptHistory = [];
        state.error = action.payload || true;
      })

      // Handle startQuiz
      .addCase(startQuiz.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(startQuiz.fulfilled, (state, action) => {
        state.loading = false;
        // The timeLeft and totalTime are updated in the component
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Handle updateRemainingTime
      .addCase(updateRemainingTime.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateRemainingTime.fulfilled, (state, action) => {
        state.loading = false;
        // Logic to update remaining time can be added here if needed
      })
      .addCase(updateRemainingTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export const {
  setSearchQuery,
  setActiveTab,
  setSelectedOptions,
  setCurrentQuestionIndex,
  setSelectedAttempt,
  setQuizResults,
  setAttemptHistory,
  setTimeLeft,
  setTotalTime,
} = stdQuizSlice.actions;

export default stdQuizSlice.reducer;
