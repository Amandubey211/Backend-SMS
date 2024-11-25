import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDashboardDetails,
  fetchSubjects,
  fetchTasks,
  fetchStudentGrades,
  fetchExamResults
} from "./studentDashboard.action";

const initialState = {
  cardData: [],
  dashboardAttendance: null,
  paidFees: 0,
  unpaidFees: 0,
  attendanceError: false,
  subjects: [],
  subjectError: false,
  tasks: [],
  examResults: [],
  taskError: false,
  gradeData: null,
  error: false,
  loading: false,
  cache: {},
};

const studentDashboardSlice = createSlice({
  name: "studentDashboard",
  initialState,
  reducers: {
    setCache: (state, action) => {
      state.cache = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handling Dashboard Data Fetching
    builder
      .addCase(fetchDashboardDetails.pending, (state) => {
        state.loading = true;
        state.attendanceError = false;
      })
      .addCase(fetchDashboardDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.cardData = action.payload.cardData;
        state.paidFees = action.payload.paidFees;
        state.unpaidFees = action.payload.unpaidFees;
        state.dashboardAttendance = action.payload.attendanceSummary;
      })
      .addCase(fetchDashboardDetails.rejected, (state, action) => {
        state.loading = false;
        state.attendanceError = action.payload || true;
      });

    // Handling Subjects Data Fetching
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.subjectError = false;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.subjectError = action.payload || true;
      });

    // Handling Tasks Data Fetching
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.taskError = false;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.taskError = action.payload || true;
      });

    // Handling Student Grades Fetching
    builder
      .addCase(fetchStudentGrades.pending, (state) => {
        state.error = false;
      })
      .addCase(fetchStudentGrades.fulfilled, (state, action) => {
        state.gradeData = action.payload;
      })
      .addCase(fetchStudentGrades.rejected, (state, action) => {
        state.error = action.payload || true;
      });


      // Handling Exam Results Fetching
    builder
    .addCase(fetchExamResults.pending, (state) => {
      state.loading = true;
      state.error = false;
    })
    .addCase(fetchExamResults.fulfilled, (state, action) => {
      state.loading = false;
      state.examResults = action.payload; // Update state with fetched results
    })
    .addCase(fetchExamResults.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch exam results.";
    });
  },
});

export const { setCache } = studentDashboardSlice.actions;
export default studentDashboardSlice.reducer;
