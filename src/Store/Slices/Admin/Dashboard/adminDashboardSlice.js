import { createSlice } from '@reduxjs/toolkit';
import { fetchNotices, fetchFilteredEvents, fetchFilteredIssueBooks, fetchAdminDashboardData, fetchEarningsData, fetchAttendanceData, fetchTopStudents } from './adminDashboard.action';

const initialState = {
  notices: [],
  events: [],
  books: [],
  topStudents:[],
  dashboardData: null,
  earningsData: null,
  attendanceData: null,
  loadingNotices: false,
  loadingEvents: false,
  loadingBooks: false,
  loadingDashboard: false,
  loadingEarnings: false,
  loadingAttendance: false,
  loadingTopStudents: false,


  errorTopStudents: null,
  errorNotices: null,
  errorEvents: null,
  errorBooks: null,
  errorDashboard: null,
  errorEarnings: null,
  errorAttendance: null,

};

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetching notices
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.loadingNotices = true;
        state.errorNotices = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loadingNotices = false;
        state.notices = action.payload;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loadingNotices = false;
        state.errorNotices = action.payload || 'Failed to fetch notices';
      });

    // Handle fetching events
    builder
      .addCase(fetchFilteredEvents.pending, (state) => {
        state.loadingEvents = true;
        state.errorEvents = null;
      })
      .addCase(fetchFilteredEvents.fulfilled, (state, action) => {
        state.loadingEvents = false;
        state.events = action.payload;
      })
      .addCase(fetchFilteredEvents.rejected, (state, action) => {
        state.loadingEvents = false;
        state.errorEvents = action.payload || 'Failed to fetch events';
      });

    // Handle fetching filtered issue books
    builder
      .addCase(fetchFilteredIssueBooks.pending, (state) => {
        state.loadingBooks = true;
        state.errorBooks = null;
      })
      .addCase(fetchFilteredIssueBooks.fulfilled, (state, action) => {
        state.loadingBooks = false;
        state.books = action.payload;
      })
      .addCase(fetchFilteredIssueBooks.rejected, (state, action) => {
        state.loadingBooks = false;
        state.errorBooks = action.payload || 'Failed to fetch issued books';
      });

    // Handle fetching admin dashboard data
    builder
      .addCase(fetchAdminDashboardData.pending, (state) => {
        state.loadingDashboard = true;
        state.errorDashboard = null;
      })
      .addCase(fetchAdminDashboardData.fulfilled, (state, action) => {
        state.loadingDashboard = false;
        state.dashboardData = action.payload; // Set dashboard data on success
      })
      .addCase(fetchAdminDashboardData.rejected, (state, action) => {
        state.loadingDashboard = false;
        state.errorDashboard = action.payload || 'Failed to fetch dashboard data'; // Handle error
      });

    // Handle fetching earnings data
    builder
      .addCase(fetchEarningsData.pending, (state) => {
        state.loadingEarnings = true;
        state.errorEarnings = null;
      })
      .addCase(fetchEarningsData.fulfilled, (state, action) => {
        state.loadingEarnings = false;
        state.earningsData = action.payload;
      })
      .addCase(fetchEarningsData.rejected, (state, action) => {
        state.loadingEarnings = false;
        state.errorEarnings = action.payload || 'Failed to fetch earnings data';
      });

    // Handle fetching attendance data
    builder
      .addCase(fetchAttendanceData.pending, (state) => {
        state.loadingAttendance = true;
        state.errorAttendance = null;
      })
      .addCase(fetchAttendanceData.fulfilled, (state, action) => {
        state.loadingAttendance = false;
        state.attendanceData = action.payload; // Set the fetched attendance data
      })
      .addCase(fetchAttendanceData.rejected, (state, action) => {
        state.loadingAttendance = false;
        state.errorAttendance = action.payload || 'Failed to fetch attendance data';
      });
    builder
      .addCase(fetchTopStudents.pending, (state) => {
        state.loadingTopStudents = true;
        state.errorTopStudents = null;
      })
      .addCase(fetchTopStudents.fulfilled, (state, action) => {
        state.loadingTopStudents = false;
        state.topStudents = action.payload; 
        state.errorTopStudents = null;
      })
      .addCase(fetchTopStudents.rejected, (state, action) => {
        state.loadingTopStudents = false;
        state.topStudents = []; 
        state.errorTopStudents = action.payload || 'Failed to fetch top students data';
      });
  },
});

export default adminDashboardSlice.reducer;