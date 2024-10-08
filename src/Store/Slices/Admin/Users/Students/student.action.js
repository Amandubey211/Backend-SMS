
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";


export const fetchAllStudents = createAsyncThunk(
  "user/allStudents",
  async (filter, { rejectWithValue, getState }) => {
    const { common } = getState();
    const token = common.auth.token;
    try {
      const response = await axios.get(`${baseUrl}/admin/all/students`, {
        headers: { Authentication: `Bearer ${token}` },
        params:filter
      });
      return response.data.data;
    } catch (error) {
     
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const studentIssueBooks = createAsyncThunk(
  'student/studentIssueBooks',
  async (id, { rejectWithValue,getState }) => {
    const { common } = getState();
    const token = common.auth.token;
      try {
          const res = await axios.get(`${baseUrl}/admin/all/bookIssue/?studentId=${id}`, {
              headers: { Authentication:  `Bearer ${token}` }
          });
          const data = res.data;
          return data;
      }
      catch (error) {
          return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))

      }
  }
)
export const fetchStudentDocument = createAsyncThunk(
  'student/studentDocument',
  async (id, { rejectWithValue,getState }) => {
    const { common } = getState();
    const token = common.auth.token;
      try {
          const response = await axios.get(`${baseUrl}/admin/documents/student/${id}`, {
              headers: { Authentication:  `Bearer ${token}` }
          });
          const data = response?.data?.documents.documents;
          return data;
      }
      catch (error) {
          return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))

      }
  }
)
export const fetchStudentAttendance = createAsyncThunk(
  'student/studentAttendance',
  async ({month, year,studentId }, { rejectWithValue,getState }) => {
    const { common } = getState();
    const token = common.auth.token;
      try {
          const response = await axios.get(`${baseUrl}/api/studentDashboard/myAttendance`, {
            params: { month, year,studentId },
              headers: { Authentication:  `Bearer ${token}` }
          });
          const { report, summary } = response.data.report;
            const attendanceMap = report.reduce((acc, entry) => {
                acc[entry.date] = entry.status;
                return acc;
            }, {});
            return{ attendanceMap,summary}
      }
      catch (error) {
          return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))

      }
  }
)
export const fetchStudentGrades = createAsyncThunk(
  'student/studentGrades',
  async ({params,studentId,studentClassId}, { rejectWithValue,getState }) => {
    const { common } = getState();
    const token = common.auth.token;
      try {
          const response = await axios.get(`${baseUrl}/admin/grades/student/${studentId}/class/${studentClassId}`, {
            params: params,
              headers: { Authentication:  `Bearer ${token}` }
          });
        return  response.data
            
      }
      catch (error) {
          return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))

      }
  }
)
export const fetchStudentSubjects = createAsyncThunk(
  'student/studentSubjects',
  async (id, { rejectWithValue,getState }) => {
    const { common } = getState();
    const token = common.auth.token;
      try {
          const response = await axios.get(`${baseUrl}/api/studentDashboard/subjects/${id}`, {
              headers: { Authentication:  `Bearer ${token}` }
          });
        return response.data.subjects
      }
      catch (error) {
          return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))

      }
  }
)
export const fetchStudentFinance = createAsyncThunk(
  'student/studentFinance',
  async (id, { rejectWithValue,getState }) => {
    const { common } = getState();
    const token = common.auth.token;
      try {
          const response = await axios.get(`${baseUrl}/student/fees/${id}`, {
              headers: { Authentication:  `Bearer ${token}` }
          });
        return response.data
      }
      catch (error) {
          return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))

      }
  }
)
export const fetchStudentSubjectProgress = createAsyncThunk(
  'student/studentSubjectProgress',
  async (id, { rejectWithValue,getState }) => {
    const { common } = getState();
    const token = common.auth.token;
      try {
          const response = await axios.get(`${baseUrl}/admin/course/subjects/student/${id}`, {
              headers: { Authentication:  `Bearer ${token}` }
          });
        return response.data.data
      }
      catch (error) {
          return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))

      }
  }
)
export const fetchAttendanceData = createAsyncThunk(
  'student/AttendanceData',
  async (id, { rejectWithValue,getState }) => {
    const { common } = getState();
    const token = common.auth.token;
      try {
          const response = await axios.get(`${baseUrl}/api/teacher/attendance/getYearlyAttendance/${id}`, {
              headers: { Authentication:  `Bearer ${token}` }
          });
        return response.data.data
      }
      catch (error) {
          return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))

      }
  }
)

export const fetchCourseProgress = createAsyncThunk(
  'student/courseProgress',
  async (ids, { rejectWithValue,getState }) => {
    const { common } = getState();
    const token = common.auth.token;
      try {
          const response = await axios.get(`${baseUrl}/admin/course/progress/student/${ids.studentId}/subject/${ids.subjectId}`, {
              headers: { Authentication:  `Bearer ${token}` }
          });
        
        return response.data.data;

      }
      catch (error) {
          return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))

      }
  }
)
