import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../../config/Common';
import { ErrorMsg, handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../Common/Alerts/alertsSlice";
import { getData } from '../../../../services/apiEndpoints';
import { getAY } from '../../../../Utils/academivYear';



// Fetch Admin Dashboard Data
export const fetchAdminDashboardData = createAsyncThunk(
  'adminDashboard/fetchAdminDashboardData',
  async (_, { rejectWithValue, dispatch }) => {
   
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`/admin/dashboard?say=${say}`);
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Attendance Data
export const fetchAttendanceData = createAsyncThunk(
  'adminDashboard/fetchAttendanceData',
  async ({ month, year }, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`/admin/dashboard/attendance?say=${say}`, { month, year },
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Earnings Data
export const fetchEarningsData = createAsyncThunk(
  'adminDashboard/fetchEarningsData',
  async ({ month, year, includeUnpaidExpenses }, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`/admin/dashboard/earnings?say=${say}`,
       { month, year, includeUnpaidExpenses },
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Notices
export const fetchNotices = createAsyncThunk(
  'adminDashboard/fetchNotices',
  async (_, { rejectWithValue,  dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`${baseUrl}/admin/dashboard/notices?say=${say}`);
      return response?.notices;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Top Students
export const fetchTopStudents = createAsyncThunk(
  'adminDashboard/TopStudents',
  async (classId, { rejectWithValue,  dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`/admin/top/students/class/${classId}?say=${say}`);
      return response?.topStudents;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Filtered Events
export const fetchFilteredEvents = createAsyncThunk(
  'adminDashboard/fetchFilteredEvents',
  async ({ month, year }, { rejectWithValue,  dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`/admin/dashboard/events?say=${say}`, 
       
       { month, year },
      );
      return response?.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Filtered Issue Books
export const fetchFilteredIssueBooks = createAsyncThunk(
  'adminDashboard/fetchFilteredIssueBooks',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`${baseUrl}/admin/all/book?say=${say}`);
      return response?.books;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
