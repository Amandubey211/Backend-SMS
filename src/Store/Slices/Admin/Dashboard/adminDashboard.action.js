import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../../config/Common';




// Fetch Admin Dashboard Data
export const fetchAdminDashboardData = createAsyncThunk(
    'adminDashboard/fetchAdminDashboardData',
    async (_, { rejectWithValue, getState }) => {
      const { role } = getState().common.auth;
      const token = localStorage.getItem(`${role}:token`);
      
      if (!token) {
        return rejectWithValue('Authentication failed!');
      }
  
      try {
        const response = await axios.get(`${baseUrl}/admin/dashboard`, {
          headers: {
            Authentication: token,
          },
        });
  
        return response?.data; // Returning the dashboard data
      } catch (error) {
        console.error('Error in fetchAdminDashboardData:', error);
        return rejectWithValue(error.message); // Passing error to the reducer
      }
    }
  );


// Fetch Notices
export const fetchNotices = createAsyncThunk(
    'adminDashboard/fetchNotices',
    async (_, { rejectWithValue, getState }) => {
        const { role } = getState().common.auth;
        const token = localStorage.getItem(`${role}:token`);
        if (!token) {
            return rejectWithValue('Authentication failed!');
        }

        try {
            const response = await axios.get(`${baseUrl}/admin/dashboard/notices`, {
                headers: {
                    Authentication: token,
                },
            });

            return response?.data?.notices;
        } catch (error) {
            console.error('Error in fetchNotices:', error);
            return rejectWithValue(error.message);
        }
    }
);



// Fetch Filtered Events
export const fetchFilteredEvents = createAsyncThunk(
    'adminDashboard/fetchFilteredEvents',
    async ({ month, year }, { rejectWithValue, getState }) => {
        const { role } = getState().common.auth;
        const token = localStorage.getItem(`${role}:token`);
        if (!token) {
            return rejectWithValue('Authentication failed!');
        }

        try {
            const response = await axios.get(`${baseUrl}/admin/dashboard/events`, {
                headers: {
                    Authentication: token,
                },
                params: { month, year },
            });

            return response?.data?.data; // Assuming the events are inside `data`
        } catch (error) {
            console.error('Error in fetchFilteredEvents:', error);
            return rejectWithValue(error.message);
        }
    }
);



// Fetch Filtered Issue Books
export const fetchFilteredIssueBooks = createAsyncThunk(
    'adminDashboard/fetchFilteredIssueBooks',
    async (_, { rejectWithValue, getState }) => {
        const { role } = getState().common.auth;
        const token = localStorage.getItem(`${role}:token`);
        if (!token) {
            return rejectWithValue('Authentication failed!');
        }

        try {
            const response = await axios.get(`${baseUrl}/admin/all/book`, {
                headers: {
                    Authentication: token,
                },
            });

            console.log('Fetched Books:', response.data.books);
            return response?.data?.books;
        } catch (error) {
            console.error('Error in fetchFilteredIssueBooks:', error);
            return rejectWithValue(error.message);
        }
    }
);

