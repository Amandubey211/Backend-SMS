import { createSlice } from "@reduxjs/toolkit";
import { stdClassTeacher } from "./classTeacher.action";

const initialState = {
  loading: false,
  error: false,
  teacherData: [],
};

export const classTeacherSlice = createSlice({
  name: "classTeacher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(stdClassTeacher.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(stdClassTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherData = action.payload;
      })
      .addCase(stdClassTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export const {} = classTeacherSlice.actions;
export default classTeacherSlice.reducer;
