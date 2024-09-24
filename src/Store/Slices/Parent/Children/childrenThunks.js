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
          'Content-Type': 'application/json',
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
