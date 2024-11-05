import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../../config/Common';
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../Common/Alerts/alertsSlice";

const say = localStorage.getItem("say");

// Helper function to get the token from Redux state
const getToken = (state, rejectWithValue, dispatch) => {
  const token = state.common.auth?.token;
  if (!token) {
    dispatch(setShowError(true));
    dispatch(setErrorMsg("Authentication Failed"));
    return rejectWithValue("Authentication Failed");
  }
  return `Bearer ${token}`;
};

// Centralized error handling
const handleError = (error, dispatch, rejectWithValue) => {
  const err = ErrorMsg(error);
  dispatch(setShowError(true));
  dispatch(setErrorMsg(err.message));
  return rejectWithValue(err.message);
};

// Fetch Admin Dashboard Data
export const fetchAdminDashboardData = createAsyncThunk(
  'adminDashboard/fetchAdminDashboardData',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/dashboard?say=${say}`, {
        headers: { Authentication: token },
      });
      return response?.data;
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
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/dashboard/attendance?say=${say}`, {
        headers: { Authentication: token },
        params: { month, year },
      });
      return response?.data;
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
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/dashboard/earnings?say=${say}`, {
        headers: { Authentication: token },
        params: { month, year, includeUnpaidExpenses },
      });
      return response?.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Notices
export const fetchNotices = createAsyncThunk(
  'adminDashboard/fetchNotices',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/dashboard/notices?say=${say}`, {
        headers: { Authentication: token },
      });
      return response?.data?.notices;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Top Students
export const fetchTopStudents = createAsyncThunk(
  'adminDashboard/TopStudents',
  async (classId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/top/students/class/${classId}?say=${say}`, {
        headers: { Authentication: token },
      });
      return response?.data?.topStudents;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Filtered Events
export const fetchFilteredEvents = createAsyncThunk(
  'adminDashboard/fetchFilteredEvents',
  async ({ month, year }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/dashboard/events?say=${say}`, {
        headers: { Authentication: token },
        params: { month, year },
      });
      return response?.data?.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Filtered Issue Books
export const fetchFilteredIssueBooks = createAsyncThunk(
  'adminDashboard/fetchFilteredIssueBooks',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/all/book?say=${say}`, {
        headers: { Authentication: token },
      });
      console.log('Fetched Books:', response.data.books);
      return response?.data?.books;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
