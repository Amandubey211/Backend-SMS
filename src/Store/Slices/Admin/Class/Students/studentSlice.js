import { createSlice } from "@reduxjs/toolkit";
import {
  fetchStudentsByClassAndSection,
  fetchAllStudents,
} from "./studentThunks";

const initialState = {
  studentsList: [],
  allStudentsList: [],
  loading: false,
  error: null,
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
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Students by Class and Section
      .addCase(fetchStudentsByClassAndSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentsByClassAndSection.fulfilled, (state, action) => {
        state.loading = false;
        state.studentsList = action.payload;
      })
      .addCase(fetchStudentsByClassAndSection.rejected, (state, action) => {
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
      });
  },
});

export const { setStudents, setAllStudents, clearError } = studentSlice.actions;
export default studentSlice.reducer;
