import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";
import { fetchStudentsByClassAndSection } from "../../Class/Students/studentThunks";

const say = localStorage.getItem("say");

// Helper function to get the token from the Redux state
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
  console.log('--er',error)
  const err = ErrorMsg(error);
  dispatch(setShowError(true));
  dispatch(setErrorMsg(err.message));
  return rejectWithValue(err.message);
};


export const fetchAllStudents = createAsyncThunk(
  "user/allStudents",
  async (filter, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.get(`${baseUrl}/admin/all/students?say=${say}`, {
        headers: { Authentication: token },
        params: filter,
      });
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateStudents = createAsyncThunk(
  "user/updateStudents",
  async ({data}, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.put(`${baseUrl}/admin/update/StudentInfo?say=${say}`,data, {
        headers: { Authentication: token },
      });
      toast.success(response.data?.message);
      dispatch(fetchAllStudents())
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const editStudents = createAsyncThunk(
  "user/editStudents",
  async ({id,data}, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.put(`${baseUrl}/admin/editStudent/${id}?say=${say}`,data, {
        headers: { Authentication: token },
      });
      if(response.data.success){
        toast.success('Student Move successfully');
      }
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Student Issue Books
export const studentIssueBooks = createAsyncThunk(
  "student/studentIssueBooks",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.get(`${baseUrl}/admin/all/bookIssue/?studentId=${id}&say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Student Document
export const fetchStudentDocument = createAsyncThunk(
  "student/studentDocument",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.get(`${baseUrl}/admin/documents/student/${id}?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data?.documents?.documents;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Student Attendance
export const fetchStudentAttendance = createAsyncThunk(
  "student/studentAttendance",
  async ({ month, year, studentId }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.get(`${baseUrl}/api/studentDashboard/myAttendance?say=${say}`, {
        headers: { Authentication: token },
        params: { month, year, studentId },
      });
      const { report, summary } = response.data.report;
      const attendanceMap = report.reduce((acc, entry) => {
        acc[entry.date] = entry.status;
        return acc;
      }, {});
      return { attendanceMap, summary };
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Student Grades
export const fetchStudentGrades = createAsyncThunk(
  "student/studentGrades",
  async ({ params, studentId, studentClassId }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.get(`${baseUrl}/admin/grades/student/${studentId}/class/${studentClassId}?say=${say}`, {
        headers: { Authentication: token },
        params,
      });
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Student Subjects
export const fetchStudentSubjects = createAsyncThunk(
  "student/studentSubjects",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.get(`${baseUrl}/api/studentDashboard/subjects/${id}?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data.subjects;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Student Finance
export const fetchStudentFinance = createAsyncThunk(
  "student/studentFinance",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.get(`${baseUrl}/student/fees/${id}?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Student Subject Progress
export const fetchStudentSubjectProgress = createAsyncThunk(
  "student/studentSubjectProgress",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.get(`${baseUrl}/admin/course/subjects/student/${id}?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Attendance Data
export const fetchAttendanceData = createAsyncThunk(
  "student/AttendanceData",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.get(`${baseUrl}/api/teacher/attendance/getYearlyAttendance/${id}?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Course Progress
export const fetchCourseProgress = createAsyncThunk(
  "student/courseProgress",
  async (ids, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.get(`${baseUrl}/admin/course/progress/student/${ids.studentId}/subject/${ids.subjectId}?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Student Task
export const fetchStudentTask = createAsyncThunk(
  "student/studentTask",
  async ({ id }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.get(`${baseUrl}/admin/task/student/${id}?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data.completedTask;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
