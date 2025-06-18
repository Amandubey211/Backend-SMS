// Import necessary functions from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";
import {
  stdGetQuiz,
  stdGetSingleQuiz,
  submitQuiz,
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
    setSelectedOption: (state, action) => {
      const { index, value, flag } = action.payload;
      if (typeof value !== "undefined") {
        state.selectedOptions[index] = flag ? { value, flag } : value;
      } else if (flag) {
        state.selectedOptions[index] = { flag };
      }
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
    resetQuizState: (state) => {
      return {
        ...state,
        loading: false,
        error: false,
        itemDetails: {},
        activeTab: "instructions",
        selectedOptions: {},
        currentQuestionIndex: 0,
        quizResults: {
          totalPoints: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
        },
        timeLeft: 0,
        totalTime: 0,
      };
    },
    resetQuizAttempt: (state) => {
      // Reset only the current attempt data
      state.selectedOptions = {};
      state.currentQuestionIndex = 0;
      state.timeLeft = 0;
      state.totalTime = 0;
      state.quizResults = {
        totalPoints: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
      };
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
        // Reset attempt-specific state when loading a new quiz
        state.selectedOptions = {};
        state.currentQuestionIndex = 0;
        state.quizResults = {
          totalPoints: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
        };
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
        state.quizResults = action.payload.results;
        state.attemptHistory = [
          ...state.attemptHistory,
          action.payload.newAttempt,
        ];
        // Don't reset selectedOptions here - they're needed for review
      })
      .addCase(submitQuiz.rejected, (state, action) => {
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
  setSelectedOption,
  setCurrentQuestionIndex,
  setSelectedAttempt,
  setQuizResults,
  setAttemptHistory,
  setTimeLeft,
  setTotalTime,
  resetQuizState,
  resetQuizAttempt,
} = stdQuizSlice.actions;

export default stdQuizSlice.reducer;
