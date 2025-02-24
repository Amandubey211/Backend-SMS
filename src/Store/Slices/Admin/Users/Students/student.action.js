import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../../config/Common";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import {
  ErrorMsg,
  handleError,
} from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";
import { fetchStudentsByClassAndSection } from "../../Class/Students/studentThunks";
import {
  customRequest,
  getData,
  putData,
} from "../../../../../services/apiEndpoints";
import { getAY } from "../../../../../Utils/academivYear";
import { getUserRole } from "../../../../../Utils/getRoles";

export const fetchAllStudents = createAsyncThunk(
  "user/allStudents",
  async (filter, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/all/students?say=${say}`,
        filter
      );
      return response?.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateStudents = createAsyncThunk(
  "user/updateStudents",
  async ({ data }, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await customRequest(
        "put",
        `/${getRole}/update/StudentInfo?say=${say}`,
        data,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      toast.success(response?.message);
      dispatch(fetchAllStudents());
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const editStudents = createAsyncThunk(
  "user/editStudents",
  async ({ id, data }, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await putData(
        `/${getRole}/editStudent/${id}?say=${say}`,
        data
      );
      if (response.success) {
        toast.success("Student Move successfully");
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
  async (id, { rejectWithValue, dispatch, getState }) => {
    try {
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const say = getAY();
      const response = await getData(
        `/${getRole}/all/bookIssue?studentId=${id}&say=${say}`
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Student Document
export const fetchStudentDocument = createAsyncThunk(
  "student/studentDocument",
  async (id, { rejectWithValue, dispatch, getState }) => {
    try {
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const say = getAY();
      const response = await getData(
        `/${getRole}/documents/student/${id}?say=${say}`
      );
      return response.documents?.documents;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Student Attendance
export const fetchStudentAttendance = createAsyncThunk(
  "student/studentAttendance",
  async (
    { month, year, studentId },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(`${getRole}/myAttendance?say=${say}`, {
        month,
        year,
        studentId,
      });
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
  async (
    { params, studentId, studentClassId },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const say = getAY();
      const semesterId = getState().common.user.classInfo.selectedSemester.id; // Fetch semesterId correctly

      const response = await getData(
        `/${getRole}/grades/student/${studentId}/class/${studentClassId}?say=${say}&semesterId=${semesterId}`,
        params
      );

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
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(
        `/${getRole}/students/subjects/${id}?say=${say}`
      );
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
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
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
      const say = getAY();
      const getRole = getUserRole(getState);
      const response = await getData(
        `/${getRole}/course/subjects/student/${id}?say=${say}`
      );
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
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(
        `/${getRole}/attendance/getYearlyAttendance/${id}?say=${say}`
      );
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
      const getRole = getUserRole(getState);
      const say = getAY();

      // ✅ Updated: Added semesterId as query parameter
      const semesterQuery = ids.semesterId ? `&semesterId=${ids.semesterId}` : "";

      const response = await getData(
        `/${getRole}/course/progress/student/${ids.studentId}/subject/${ids.subjectId}?say=${say}${semesterQuery}`
      );
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
      const getRole = getUserRole(getState);
      const say = getAY();
      const response = await getData(
        `/${getRole}/task/student/${id}?say=${say}`
      );
      return response.completedTask;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
