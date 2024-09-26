import { createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from "../../../../config/Common";
import toast from "react-hot-toast";
import axios from "axios";
// Thunk to fetch children
export const fetchChildren = createAsyncThunk(
  "dashboard/fetchChildren",
  async () => {
    const token = localStorage.getItem("parent:token");
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData || !userData.email) {
      toast.error("No guardian email found");
      return [];
    }

    try {
      const response = await axios.get(
        `${baseUrl}/parent/api/children?email=${encodeURIComponent(userData.email)}`,
        {
          headers: {
            Authentication: `${token}`,
          },
        }
      );
      return response.data.children;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch children data";
      toast.error(errorMessage);
      return [];
    }
  }
);


// Thunk to fetch attendance
export const fetchAttendance = createAsyncThunk(
  'children/fetchAttendance',
  async ({ studentId, month, year }) => {
    try {
      const token = localStorage.getItem('parent:token');
      const response = await fetch(`${baseUrl}/api/studentDashboard/myAttendance?studentId=${studentId}&month=${month}&year=${year}`, {
        method: 'GET',
        headers: {
          'Authentication': `${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch attendance");
      }

      const data = await response.json();
      return data.report.report;
    } catch (error) {
      throw error;
    }
  }
);



// Thunk to fetch teachers
export const fetchTeachers = createAsyncThunk(
  "children/fetchTeachers",
  async (studentId, { rejectWithValue }) => {
    const token = localStorage.getItem("parent:token");
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData || !userData.email) {
      toast.error("No guardian email found");
      return rejectWithValue("No guardian email found");
    }

    if (!token) {
      toast.error("No token found");
      return rejectWithValue("No token found");
    }

    try {
      const response = await axios.get(`${baseUrl}/parent/api/instructors/${studentId}`, {
        headers: {
          Authentication: `${token}`,
        },
      });

      if (!response.data || response.data.instructors.length === 0) {
        return [];  // No instructors found
      }

      return response.data.instructors;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch instructors";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


// Thunk to fetch grades for a specific student and subject
export const fetchGrades = createAsyncThunk(
  'children/fetchGrades',
  async ({ studentId, subjectId }, { rejectWithValue }) => {
    const token = localStorage.getItem('parent:token');
    if (!token) {
      toast.error("Authentication token not found");
      return rejectWithValue("Authentication token not found");
    }

    try {
      const response = await axios.get(`${baseUrl}/api/studentDashboard/subjects/${studentId}`, {
        headers: { Authentication: token },
      });
      
      return response.data.grades;  // Assuming the response has a grades field
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching grades';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);