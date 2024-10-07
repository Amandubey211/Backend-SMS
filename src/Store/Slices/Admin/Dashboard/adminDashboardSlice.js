import { createSlice } from '@reduxjs/toolkit';
import { fetchNotices, fetchFilteredEvents, fetchFilteredIssueBooks, fetchAdminDashboardData } from './adminDashboard.action';

const initialState = {
  notices: [],
  events: [],
  books: [],
  dashboardData: null,
  loading: false,
  error: null,
};

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetching notices
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch notices';
      });

    // Handle fetching events
    builder
      .addCase(fetchFilteredEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchFilteredEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch events';
      });

    // Handle fetching filtered issue books
    builder
      .addCase(fetchFilteredIssueBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredIssueBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchFilteredIssueBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch issued books';
      })

    // Handle fetching admin dashboard data
    builder
      .addCase(fetchAdminDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload; // Set dashboard data on success
      })
      .addCase(fetchAdminDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch dashboard data'; // Handle error
      });
  },
});

export default adminDashboardSlice.reducer;
