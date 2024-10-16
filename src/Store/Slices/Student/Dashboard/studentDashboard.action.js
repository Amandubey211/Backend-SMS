import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../../config/Common';

// Fetch Dashboard Details
export const fetchDashboardDetails = createAsyncThunk(
  'studentDashboard/fetchDashboardDetails',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('student:token');
    if (!token) {
      return rejectWithValue('Authentication failed!');
    }

    try {
      const response = await axios.get(`${baseUrl}/api/studentDashboard/dashboard/student`, {
        headers: {
          Authentication: token,
        },
      });

      const data = response?.data;
      const { attendanceSummary } = data.data;

      return {
        cardData: formatDashboardData(data),
        paidFees: data?.data?.totalPaidFees,
        unpaidFees: data?.data?.dueFees,
        attendanceSummary,
      };
    } catch (error) {
      console.error('Error in fetchDashboardDetails:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Subjects
export const fetchSubjects = createAsyncThunk(
  'studentDashboard/fetchSubjects',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('student:token');
    if (!token) {
      return rejectWithValue('Authentication failed!');
    }

    try {
      const persistUserString = localStorage.getItem('persist:user');
      const persistUserObject = JSON.parse(persistUserString);
      const userDetails = JSON.parse(persistUserObject.userDetails);
      const userId = userDetails.userId;

      const response = await axios.get(`${baseUrl}/api/studentDashboard/subjects/${userId}`, {
        headers: {
          Authentication: token,
        },
      });

      return response?.data?.subjects;
    } catch (error) {
      console.error('Error in fetchSubjects:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Tasks
export const fetchTasks = createAsyncThunk(
  'studentDashboard/fetchTasks',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('student:token');
    const persistUserString = localStorage.getItem('persist:user');
    const persistUserObject = JSON.parse(persistUserString);
    const userDetails = JSON.parse(persistUserObject.userDetails);
    const studentId = userDetails.userId;

    if (!token) {
      return rejectWithValue('Authentication failed!');
    }

    try {
      const response = await axios.get(`${baseUrl}/admin/task/student/${studentId}`, {
        headers: {
          Authentication: token,
        },
      });

      return response?.data?.completedTask;
    } catch (error) {
      console.error('Error in fetchTasks:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Student Grades
export const fetchStudentGrades = createAsyncThunk(
  'studentDashboard/fetchStudentGrades',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('student:token');
    const classId = localStorage.getItem('classId');
    const persistUserString = localStorage.getItem('persist:user');
    const persistUserObject = JSON.parse(persistUserString);
    const userDetails = JSON.parse(persistUserObject.userDetails);
    const studentId = userDetails.userId;

    if (!studentId || !classId) {
      return rejectWithValue('Invalid student or class ID.');
    }

    try {
      const response = await axios.get(`${baseUrl}/admin/grades/student/${studentId}/class/${classId}`, {
        headers: {
          Authentication: token,
        },
      });

      return response?.data;
    } catch (error) {
      console.error('Error in fetchStudentGrades:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to format dashboard data
const formatDashboardData = (dashboardData) => {
  return [
    {
      label: 'Upcoming Exam',
      value: dashboardData?.data?.upcomingExam,
      bgColor: 'bg-green-100',
      textColor: 'text-black-500',
      icon: '📝',
    },
    {
      label: 'Due Fees',
      value: dashboardData?.data?.dueFees,
      bgColor: 'bg-red-100',
      textColor: 'text-black-500',
      icon: '💸',
    },
    {
      label: 'Event',
      value: dashboardData?.data?.events,
      bgColor: 'bg-blue-100',
      textColor: 'text-black-500',
      icon: '📅',
    },
    {
      label: 'Notice',
      value: dashboardData?.data?.notices,
      bgColor: 'bg-yellow-100',
      textColor: 'text-black-500',
      icon: '🔔',
    },
  ];
};
