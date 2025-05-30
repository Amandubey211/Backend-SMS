import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllStudents,
  fetchAttendanceData,
  fetchCourseProgress,
  fetchStudentAttendance,
  fetchStudentDocument,
  fetchStudentFinance,
  fetchStudentGrades,
  fetchStudentSubjectProgress,
  fetchStudentSubjects,
  fetchStudentTask,
  studentIssueBooks,
} from "./student.action";
const initialState = {
  allStudents: [],
  student: {},
  studentDocument: [],
  StudentAttendance: {},
  attendanceData: {},
  StudentAttendanceSummary: {},
  studentSubjects: [],
  bookIssue: [],
  feesDetails: {},
  bookIssue: [],
  studentSubjectProgress: [],
  courseProgress: {},
  grades: {},
  error: null,
  loading: false,
  completedTask: 0,
  inCompletedTask: 100,
};
const allStudentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setAllStudents(state, action) {
      state.allStudents = action.payload;
    },
    setStudent(state, action) {
      state.student = action.payload;
    },
    setIssueBooks(state, action) {
      state.bookIssue = action.payload?.books;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Students
      .addCase(fetchAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.allStudents = action.payload;
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(studentIssueBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(studentIssueBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.bookIssue = action.payload?.books;
      })
      .addCase(studentIssueBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.studentDocument = action.payload;
      })
      .addCase(fetchStudentDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.StudentAttendance = action.payload.attendanceMap;
        state.StudentAttendanceSummary = action.payload.summary;
      })
      .addCase(fetchStudentAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentGrades.fulfilled, (state, action) => {
        state.loading = false;
        state.grades = action.payload;
      })
      .addCase(fetchStudentGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.studentSubjects = action.payload;
      })
      .addCase(fetchStudentSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentFinance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentFinance.fulfilled, (state, action) => {
        state.loading = false;
        state.feesDetails = action.payload;
      })
      .addCase(fetchStudentFinance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || [];
      })
      .addCase(fetchStudentSubjectProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentSubjectProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.studentSubjectProgress = action.payload || [];
      })
      .addCase(fetchStudentSubjectProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || [];
      })
      .addCase(fetchAttendanceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceData.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceData = action.payload || [];
      })
      .addCase(fetchAttendanceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCourseProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.courseProgress = action.payload;
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentTask.fulfilled, (state, action) => {
        state.loading = false;
        state.completedTask = action.payload;
        state.inCompletedTask = 100 - action.payload;
      })
      .addCase(fetchStudentTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setStudent, setAllStudents, clearError, setIssueBooks } =
  allStudentSlice.actions;
export default allStudentSlice.reducer;
