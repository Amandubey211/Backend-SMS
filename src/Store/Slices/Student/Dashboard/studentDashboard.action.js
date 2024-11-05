import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../../config/Common';
import { CiMoneyBill } from 'react-icons/ci';
import { setErrorMsg, setShowError } from '../../Common/Alerts/alertsSlice';
import {ErrorMsg } from '../../Common/Alerts/errorhandling.action';

const say = localStorage.getItem('say');

// Fetch Dashboard Details
export const fetchDashboardDetails = createAsyncThunk(
  'studentDashboard/fetchDashboardDetails',
  async (_, { rejectWithValue, dispatch,getState }) => {
    const token = localStorage.getItem('student:token');
    const say = localStorage.getItem("say")
    if (!token) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg('Authentication failed!'));
      return rejectWithValue('Authentication failed!');
    }

    try {
      const response = await axios.get(`${baseUrl}/api/studentDashboard/dashboard/student?say=${say}`, {
        headers: { Authentication: token },
      });

      const data = response?.data;
      const { attendanceSummary } = data.data;
      const { student } = await getState(); 
  const notices =   student.studentAnnouncement.noticeData.length || 0
      return {
        cardData: formatDashboardData(data,notices),
        paidFees: data?.data?.totalPaidFees,
        unpaidFees: data?.data?.dueFees,
        attendanceSummary,
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch dashboard details.";
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message);
    }
  }
);

// Fetch Subjects
export const fetchSubjects = createAsyncThunk(
  'studentDashboard/fetchSubjects',
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem('student:token');
    const say = localStorage.getItem("say")
    if (!token) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg('Authentication failed!'));
      return rejectWithValue('Authentication failed!');
    }

    try {
      const persistUserString = localStorage.getItem('persist:user');
      const persistUserObject = JSON.parse(persistUserString);
      const userDetails = JSON.parse(persistUserObject.userDetails);
      const userId = userDetails.userId;

      const response = await axios.get(`${baseUrl}/api/studentDashboard/subjects/${userId}?say=${say}`, {
        headers: { Authentication: token },
      });

      return response?.data?.subjects;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch subjects.";
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message)
    }
  }
);

// Fetch Tasks
export const fetchTasks = createAsyncThunk(
  'studentDashboard/fetchTasks',
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem('student:token');
    const persistUserString = localStorage.getItem('persist:user');
    const persistUserObject = JSON.parse(persistUserString);
    const userDetails = JSON.parse(persistUserObject.userDetails);
    const studentId = userDetails.userId;

    if (!token) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg('Authentication failed!'));
      return rejectWithValue('Authentication failed!');
    }
    const say = localStorage.getItem("say")
    try {
      const response = await axios.get(`${baseUrl}/admin/task/student/${studentId}?say=${say}`, {
        headers: { Authentication: token },
      });

      return response?.data?.completedTask;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch tasks.";
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message)
    }
  }
);

// Fetch Student Grades
export const fetchStudentGrades = createAsyncThunk(
  'studentDashboard/fetchStudentGrades',
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem('student:token');
    const classId = localStorage.getItem('classId');
    const persistUserString = localStorage.getItem('persist:user');
    const persistUserObject = JSON.parse(persistUserString);
    const userDetails = JSON.parse(persistUserObject.userDetails);
    const studentId = userDetails.userId;
    const say = localStorage.getItem("say")
    if (!studentId || !classId) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg('Invalid student or class ID.'));
      return rejectWithValue('Invalid student or class ID.');
    }

    try {
      const response = await axios.get(`${baseUrl}/admin/grades/student/${studentId}/class/${classId}?say=${say}`, {
        headers: { Authentication: token },
      });

      return response?.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch student grades.";
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message)
    }
  }
);

// Helper function to format dashboard data
const formatDashboardData = (dashboardData,notices) => {
  return [
    {
      label: 'Upcoming Exam',
      value: dashboardData?.data?.upcomingExam,
      bgColor: 'bg-green-100',
      textColor: 'text-black-500',
      icon: '📝',
      url:'/student_dash'
    },
    {
      label: 'Due Fees',
      value: dashboardData?.data?.dueFees,
      bgColor: 'bg-red-100',
      textColor: 'text-black-500',
      icon: <CiMoneyBill />,
      url:'/student_finance'
    },
    {
      label: 'Event',
      value: dashboardData?.data?.events,
      bgColor: 'bg-blue-100',
      textColor: 'text-black-500',
      icon: '📅',
      url:'/student/noticeboard/events'
    },
    {
      label: 'Notice',
      value: notices,
      bgColor: 'bg-yellow-100',
      textColor: 'text-black-500',
      icon: '🔔',
      url:'/student/noticeboard/announcements'
    },
  ];
};
