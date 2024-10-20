import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAssignedAssignmentStudents,
  fetchStudentAssignment,
  assignAssignmentGrade,
} from "./AssignmentSpeedGradeThunks";
import {
  fetchAssignedQuizStudents,
  fetchStudentQuiz,
  assignQuizGrade,
} from "./QuizSpeedGradeThunks";

const initialState = {
  loading: false,
  error: null,
  students: [],
  assignmentDetails: null,
  quizDetails: null,
  gradeAssignmentLoading: false, // Added loading state for assignment grade submission
  gradeQuizLoading: false, // Added loading state for quiz grade submission
};

const speedGradeSlice = createSlice({
  name: "speedGrade",
  initialState,
  reducers: {
    resetState: (state) => {
      state.students = [];
      state.assignmentDetails = null;
      state.quizDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Assignment Student Fetch Thunks
      .addCase(fetchAssignedAssignmentStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedAssignmentStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchAssignedAssignmentStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Assignment Details Thunks
      .addCase(fetchStudentAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignmentDetails = action.payload;
      })
      .addCase(fetchStudentAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Assignment Grade Submission Thunks
      .addCase(assignAssignmentGrade.pending, (state) => {
        state.gradeAssignmentLoading = true;
        state.error = null;
      })
      .addCase(assignAssignmentGrade.fulfilled, (state) => {
        state.gradeAssignmentLoading = false;
      })
      .addCase(assignAssignmentGrade.rejected, (state, action) => {
        state.gradeAssignmentLoading = false;
        state.error = action.payload || action.error.message;
      })

      // Quiz Student Fetch Thunks
      .addCase(fetchAssignedQuizStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedQuizStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchAssignedQuizStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Quiz Details Thunks
      .addCase(fetchStudentQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizDetails = action.payload;
      })
      .addCase(fetchStudentQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Quiz Grade Submission Thunks
      .addCase(assignQuizGrade.pending, (state) => {
        state.gradeQuizLoading = true;
        state.error = null;
      })
      .addCase(assignQuizGrade.fulfilled, (state) => {
        state.gradeQuizLoading = false;
      })
      .addCase(assignQuizGrade.rejected, (state, action) => {
        state.gradeQuizLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetState } = speedGradeSlice.actions;
export default speedGradeSlice.reducer;
