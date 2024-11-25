import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import { ErrorMsg, handleError } from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";
import { fetchStudentsByClassAndSection } from "../../Class/Students/studentThunks";
import { getData, putData } from "../../../../../services/apiEndpoints";

const say = localStorage.getItem("say");



export const fetchAllStudents = createAsyncThunk(
  "user/allStudents",
  async (filter, { rejectWithValue, dispatch }) => {
    try {
      const say = localStorage.getItem("say");
      dispatch(setShowError(false));
      const response = await getData(`${baseUrl}/admin/all/students?say=${say}`,filter);
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateStudents = createAsyncThunk(
  "user/updateStudents",
  async ({data}, { rejectWithValue, dispatch }) => {
    try {
      const say = localStorage.getItem("say");
      dispatch(setShowError(false));
      const response = await putData(`/admin/update/StudentInfo?say=${say}`,data);
      toast.success(response?.message);
      dispatch(fetchAllStudents())
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const editStudents = createAsyncThunk(
  "user/editStudents",
  async ({id,data}, { rejectWithValue, dispatch }) => {
    try {
      const say = localStorage.getItem("say");
      dispatch(setShowError(false));
      const response = await putData(`/admin/editStudent/${id}?say=${say}`,data);
      if(response.success){
        toast.success('Student Move successfully');
      }
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Student Issue Books
export const studentIssueBooks = createAsyncThunk(
  "student/studentIssueBooks",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const say = localStorage.getItem("say");
      const response = await getData(`/admin/all/bookIssue/?studentId=${id}&say=${say}`);
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Student Document
export const fetchStudentDocument = createAsyncThunk(
  "student/studentDocument",
  async (id, { rejectWithValue,  dispatch }) => {
    try {
      dispatch(setShowError(false));
      const say = localStorage.getItem("say");
      const response = await getData(`/admin/documents/student/${id}?say=${say}`);
      return response.documents?.documents;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Student Attendance
export const fetchStudentAttendance = createAsyncThunk(
  "student/studentAttendance",
  async ({ month, year, studentId }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const say = localStorage.getItem("say");
      const response = await getData(`/api/studentDashboard/myAttendance?say=${say}`,{ month, year, studentId },
      );
      const { report, summary } = response.report;
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
      dispatch(setShowError(false));
      const say = localStorage.getItem("say");
      const response = await getData(`/admin/grades/student/${studentId}/class/${studentClassId}?say=${say}`,params);
      return response;
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
      dispatch(setShowError(false));
      const say = localStorage.getItem("say");
      const response = await getData(`/api/studentDashboard/subjects/${id}?say=${say}`);
      return response.subjects;
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
      dispatch(setShowError(false));
      const say = localStorage.getItem("say");
      const response = await getData(`/student/fees/${id}?say=${say}`);
      return response;
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
      dispatch(setShowError(false));
      const say = localStorage.getItem("say");
      const response = await getData(`/admin/course/subjects/student/${id}?say=${say}`);
      return response.data;
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
      dispatch(setShowError(false));
      const say = localStorage.getItem("say");
      const response = await getData(`/api/teacher/attendance/getYearlyAttendance/${id}?say=${say}`);
      return response.data;
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
      dispatch(setShowError(false));
      const say = localStorage.getItem("say");
      const response = await getData(`${baseUrl}/admin/course/progress/student/${ids.studentId}/subject/${ids.subjectId}?say=${say}`);
      return response.data;
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
      dispatch(setShowError(false));
      const say = localStorage.getItem("say");
      const response = await getData(`/admin/task/student/${id}?say=${say}`);
      return response.completedTask;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
