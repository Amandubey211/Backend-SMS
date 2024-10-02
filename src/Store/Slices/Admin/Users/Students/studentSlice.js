import { createSlice } from "@reduxjs/toolkit";
import { fetchAllStudents } from "./student.action";
const initialState = {
    allStudents:[],
    student:{},
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
        });
    },
  });
  
  export const { setStudent, setAllStudents, clearError } = allStudentSlice.actions;
  export default allStudentSlice.reducer;
  