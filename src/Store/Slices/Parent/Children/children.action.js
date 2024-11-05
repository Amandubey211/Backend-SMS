import { createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from "../../../../config/Common";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import {ErrorMsg} from "../../Common/Alerts/errorhandling.action";
import axios from "axios";

const say = localStorage.getItem('say');

// Thunk to fetch children
export const fetchChildren = createAsyncThunk(
  "dashboard/fetchChildren",
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("parent:token");
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData || !userData.email) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("No guardian email found"));
      return rejectWithValue("No guardian email found");
    }

    try {
      const response = await axios.get(`${baseUrl}/parent/api/children?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data.children;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch children data";
     const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message)
    }
  }
);

// Thunk to fetch attendance
export const fetchAttendance = createAsyncThunk(
  "children/fetchAttendance",
  async ({ studentId, month, year }, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("parent:token");
    if (!token) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Authentication failed"));
      return rejectWithValue("Authentication failed");
    }

    try {
      const response = await axios.get(
        `${baseUrl}/api/studentDashboard/myAttendance?studentId=${studentId}&month=${month}&year=${year}&say=${say}`,
        { headers: { Authentication: token } }
      );
      return response.data.report.report;
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message || "Failed to fetch attendance";
     const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message)
    }
  }
);

// Thunk to fetch teachers
export const fetchTeachers = createAsyncThunk(
  "children/fetchTeachers",
  async (studentId, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("parent:token");
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData || !userData.email) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("No guardian email found"));
      return rejectWithValue("No guardian email found");
    }

    if (!token) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Authentication failed"));
      return rejectWithValue("Authentication failed");
    }

    try {
      const response = await axios.get(`${baseUrl}/parent/api/instructors/${studentId}?say=${say}`, {
        headers: { Authentication: token },
      });

      return response.data.instructors || [];
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch instructors";
     const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message)
    }
  }
);

// Thunk to fetch grades
export const fetchGrades = createAsyncThunk(
  'children/fetchGrades',
  async ({ studentId }, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem('parent:token');
    if (!token) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Authentication failed"));
      return rejectWithValue("Authentication failed");
    }

    try {
      const response = await axios.get(`${baseUrl}/api/studentDashboard/subjects/${studentId}?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data.grades;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error fetching grades";
     const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message)
    }
  }
);

// Thunk to fetch modules
export const fetchModules = createAsyncThunk(
  "children/fetchModules",
  async ({ studentId, subjectId, presentClassId }, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("parent:token");
    if (!token) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Authentication failed"));
      return rejectWithValue("Authentication failed");
    }

    try {
      const response = await axios.get(
        `${baseUrl}/admin/parent/classes/${presentClassId}/modules/${subjectId}/studentId/${studentId}?say=${say}`,
        { headers: { Authentication: token } }
      );
      return response.data.data.modules;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch modules";
     const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message)
    }
  }
);

// Thunk to fetch subjects
export const fetchSubjects = createAsyncThunk(
  "children/fetchSubjects",
  async (studentId, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("parent:token");
    if (!token) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Authentication failed"));
      return rejectWithValue("Authenticationfailed");
    }

    try {
      const response = await axios.get(
        `${baseUrl}/admin/course/subjects/student/${studentId}?say=${say}`,
        { headers: { Authentication: token } }
      );
      return response.data.subjects;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "No Subject Found";
     const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message)
    }
  }
);
