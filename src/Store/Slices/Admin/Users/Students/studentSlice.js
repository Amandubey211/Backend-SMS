import { createSlice } from "@reduxjs/toolkit";
import { fetchAllStudents, fetchStudentAttendance, fetchStudentDocument, fetchStudentFinance, fetchStudentGrades, fetchStudentSubjects, studentIssueBooks } from "./student.action";
const initialState = {
    allStudents:[],
    student:{},
    studentDocument:[],
    StudentAttendance:{},
    StudentAttendanceSummary:{},
    studentSubjects:[],
    bookIssue:[],
    feesDetails:{},
    bookIssue:[],
    grades:{},
    error:null,
    loading:false,
}
const allStudentSlice = createSlice({
    name: "students",
    initialState,
    reducers: {
      setAllStudents(state, action) {
        state.allStudents = action.payload;
      },
      setStudent(state, action) {
        state.student= action.payload;
      },
      setIssueBooks(state,action){
        state.bookIssue = action.payload.books
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
          state.bookIssue = action.payload.books;
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
          state.error = action.payload;
        });
    },
  });
  
  export const { setStudent, setAllStudents, clearError,setIssueBooks } = allStudentSlice.actions;
  export default allStudentSlice.reducer;
  