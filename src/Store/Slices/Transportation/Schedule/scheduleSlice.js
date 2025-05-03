import { createSlice } from '@reduxjs/toolkit';
import { getSchedules } from './schedule.action'; 

const initialState = {
  schedules: [],
  loading: false,
  error: null,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handling async actions (like fetching data)
    builder
      .addCase(getSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload?.shifts;
      })
      .addCase(getSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export default scheduleSlice.reducer;
