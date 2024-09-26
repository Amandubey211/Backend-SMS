import { createSlice } from "@reduxjs/toolkit";
import { fetchChildren, fetchAttendance, fetchTeachers } from './children.action';

const initialState = {
  children: [],
  attendance: [],
  teachers: [],  // New state for teachers
  loading: false,
  error: null,
};

const childrenSlice = createSlice({
  name: 'children',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching children
      .addCase(fetchChildren.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.loading = false;
        state.children = action.payload;
      })
      .addCase(fetchChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetching attendance
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetching teachers
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default childrenSlice.reducer;
