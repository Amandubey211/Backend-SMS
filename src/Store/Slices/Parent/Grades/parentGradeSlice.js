// Store/Slices/Parent/Grades/parentGradeSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchParentStudentGrades } from "./parentGrade.action";

const initialState = {
  grades: {
    grades: [], // Ensure it's always an array
    student: null, // Store student details
    total: 0,
    attendance: 0,
    totalScoreOfSubmitAssignments: 0,
    totalScoreOfAllAssignments: 0,
    totalQuizCompletedScore: 0,
    totalScoreOfAllQuizzes: 0,
    totalGroupAssignmentScore: 0,
    submittedGroupAssignmentScore: 0,
    totalGroupQuizScore: 0,
    submittedGroupQuizScore: 0,
    totalOfflineExamsScore: 0,
    totalScoreOfOfflineExams:0
  },
  loading: false,
  error: null,
};

const parentGradeSlice = createSlice({
  name: "parentGrades",
  initialState,
  reducers: {
    resetGrades(state) {
      state.grades = { ...initialState.grades }; // Reset to default structure
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentStudentGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParentStudentGrades.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload && action.payload.success) {
          // Ensure we store the correct structure
          state.grades = {
            grades: action.payload.grades || [],
            student: action.payload.student || null,
            total: action.payload.total || 0,
            attendance: action.payload.attendance || 0,
            totalScoreOfSubmitAssignments:
              action.payload.totalScoreOfSubmitAssignments || 0,
            totalScoreOfAllAssignments:
              action.payload.totalScoreOfAllAssignments || 0,
            totalQuizCompletedScore:
              action.payload.totalQuizCompletedScore || 0,
            totalScoreOfAllQuizzes: action.payload.totalScoreOfAllQuizzes || 0,
            totalGroupAssignmentScore:
              action.payload.totalGroupAssignmentScore || 0,
            submittedGroupAssignmentScore:
              action.payload.submittedGroupAssignmentScore || 0,
            totalGroupQuizScore: action.payload.totalGroupQuizScore || 0,
            submittedGroupQuizScore:
              action.payload.submittedGroupQuizScore || 0,
            totalOfflineExamsScore: action.payload.totalOfflineExams || 0,
            totalScoreOfOfflineExams:action.payload.totalScoreOfOfflineExams || 0
          };
        } else {
          state.grades = { ...initialState.grades };
        }
      })
      .addCase(fetchParentStudentGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch grades.";
        state.grades = { ...initialState.grades }; // Reset data on error
      });
  },
});

export const { resetGrades } = parentGradeSlice.actions;
export default parentGradeSlice.reducer;
