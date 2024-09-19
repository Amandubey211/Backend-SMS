import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../../config/Common';

// Async thunk for fetching parent dashboard data
export const fetchParentDashboardData = createAsyncThunk(
  'parent/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('parent:token');
      const response = await axios.get(`${baseUrl}/parent/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Error fetching dashboard data');
    }
  }
);

const parentSlice = createSlice({
  name: 'parent',
  initialState: {
    dashboardData: {
      dueFees: 0,
      upcomingExamsCount: 0,
      publishedResultsCount: 0,
      totalExpenses: 0,
      childrenCount: 0,
      notices: [],
      finance: [],
    },
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchParentDashboardData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchParentDashboardData.fulfilled, (state, action) => {
      state.dashboardData = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchParentDashboardData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default parentSlice.reducer;
