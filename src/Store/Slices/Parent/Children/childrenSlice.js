import { createSlice } from '@reduxjs/toolkit';
import { fetchChildren, fetchAttendance } from './childrenThunks';

const initialState = {
  children: [],
  attendance: [],
  loading: false,
  error: false,
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
        state.error = false;
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
        state.error = false;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default childrenSlice.reducer;
