import { createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from "../../../../config/Common";
import toast from "react-hot-toast";
import axios from "axios";


// Thunk to fetch children
export const fetchChildren = createAsyncThunk(
  "dashboard/fetchChildren",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("parent:token");
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData || !userData.email) {
      // toast.error("No guardian email found");
      return rejectWithValue("No guardian email found");
    }

    try {
      const response = await axios.get(
        `${baseUrl}/parent/api/children`,
        {
          headers: {
            Authentication: token,
          },
        }
      );
      return response.data.children;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch children data";
      // toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);



// Thunk to fetch attendance
export const fetchAttendance = createAsyncThunk(
  "children/fetchAttendance",
  async ({ studentId, month, year }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("parent:token");
      if (!token) {
        // toast.error("Authentication token not found");
        return rejectWithValue("Authentication token not found");
      }

      const response = await axios.get(
        `${baseUrl}/api/studentDashboard/myAttendance?studentId=${studentId}&month=${month}&year=${year}`,
        {
          headers: { Authentication: token },
        }
      );

      return response.data.report.report;
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || error.message || "Failed to fetch attendance";
      // toast.error(errorMessage);
      return rejectWithValue(errorMessage);
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
      // toast.error("No guardian email found");
      return rejectWithValue("No guardian email found");
    }

    if (!token) {
      // toast.error("No token found");
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


      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch instructors";
      // // toast.error(errorMessage);


      return rejectWithValue(errorMessage);
    }
  }
);








// Thunk to fetch grades for a specific student and subject
export const fetchGrades = createAsyncThunk(
  'children/fetchGrades',
  async ({ studentId }, { rejectWithValue }) => {
    const token = localStorage.getItem('parent:token');
    if (!token) {
      // toast.error("Authentication token not found");
      return rejectWithValue("Authentication token not found");
    }

    try {
      const response = await axios.get(`${baseUrl}/api/studentDashboard/subjects/${studentId}`, {
        headers: { Authentication: token },
      });
      
      return response.data.grades;  // Assuming the response has a grades field
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message ||'Error fetching grades';
      // toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);




// Fetch modules for a specific subject
export const fetchModules = createAsyncThunk(
  "children/fetchModules",
  async ({ studentId, subjectId, presentClassId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("parent:token");
      if (!token) {
        // toast.error("Authentication token not found");
        return rejectWithValue("Authentication token not found");
      }

      const response = await axios.get(
        `${baseUrl}/admin/parent/classes/${presentClassId}/modules/${subjectId}/studentId/${studentId}`,
        {
          headers: { Authentication: token },
        }
      );
      return response.data.data.modules;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch modules";
      // toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch subjects for a student
export const fetchSubjects = createAsyncThunk(
  "children/fetchSubjects",
  async (studentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("parent:token");
      if (!token) {
        // toast.error("Authentication token not found");
        return rejectWithValue("Authentication token not found");
      }

      const response = await axios.get(
        `${baseUrl}/api/studentDashboard/subjects/${studentId}`,
        {
          headers: { Authentication: token },
        }
      );
      return response.data.subjects;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch subjects";
      // toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);