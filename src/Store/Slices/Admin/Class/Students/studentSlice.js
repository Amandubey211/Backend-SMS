import { createSlice } from "@reduxjs/toolkit";
import {
  fetchStudentsByClassAndSection,
  fetchAllStudents,
  promoteStudents,
  promoteInSameClassStudents,
  graduateStudents,
  demoteStudents,
  fetchGraduates,
  fetchStudentsByClassAndSectionNames,
} from "./studentThunks";

const initialState = {
  studentsList: [],
  allStudentsList: [],
  graduatesList: [],
  loading: false,
  error: null,
  successMessage: null,
};

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setStudents(state, action) {
      state.studentsList = action.payload;
    },
    setAllStudents(state, action) {
      state.allStudentsList = action.payload;
    },
    clearError(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Students by Class and Section
      .addCase(fetchStudentsByClassAndSectionNames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentsByClassAndSectionNames.fulfilled, (state, action) => {
        state.loading = false;
        state.studentsList = action.payload;
      })
      .addCase(fetchStudentsByClassAndSectionNames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Students
      .addCase(fetchAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.allStudentsList = action.payload;
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Promote Students
      .addCase(promoteStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(promoteStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Students promoted successfully";
      })
      .addCase(promoteStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Promote Students in Same Class
      .addCase(promoteInSameClassStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(promoteInSameClassStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          "Students promoted in the same class successfully";
      })
      .addCase(promoteInSameClassStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Graduate Students
      .addCase(graduateStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(graduateStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Students graduated successfully";
      })
      .addCase(graduateStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Demote Students
      .addCase(demoteStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(demoteStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Students demoted successfully";
      })
      .addCase(demoteStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Graduates
      .addCase(fetchGraduates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGraduates.fulfilled, (state, action) => {
        state.loading = false;
        state.graduatesList = action.payload.data;
      })
      .addCase(fetchGraduates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setStudents, setAllStudents, clearError } = studentSlice.actions;
export default studentSlice.reducer;
