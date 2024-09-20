// src/Store/Slices/Admin/Verification/verificationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  verifyStudent,
  assignClassToStudent,
  fetchUnverifiedStudents,
  fetchRejectedStudents,
} from "./VerificationThunks";

const initialState = {
  unVerifiedStudents: [],
  rejectedStudents: [],
  loading: false,
  error: null,
};

const verificationSlice = createSlice({
  name: "verification",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnverifiedStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnverifiedStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.unVerifiedStudents = action.payload;
      })
      .addCase(fetchUnverifiedStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRejectedStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRejectedStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.rejectedStudents = action.payload;
      })
      .addCase(fetchRejectedStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyStudent.fulfilled, (state, action) => {
        state.loading = false;
        const updatedStudent = action.payload;
        state.unVerifiedStudents = state.unVerifiedStudents.map((student) =>
          student._id === updatedStudent._id ? updatedStudent : student
        );
      })
      .addCase(verifyStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignClassToStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignClassToStudent.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(assignClassToStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = verificationSlice.actions;
export default verificationSlice.reducer;
