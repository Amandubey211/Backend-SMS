import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../config/Common";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import { ErrorMsg, handleError } from "../../Common/Alerts/errorhandling.action";
import axios from "axios";
import { getAY } from "../../../../Utils/academivYear";
import { getData } from "../../../../services/apiEndpoints";


// Thunk to fetch children
export const fetchChildren = createAsyncThunk(
  "dashboard/fetchChildren",
  async (_, { rejectWithValue, dispatch }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData || !userData.email) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("No guardian email found"));
      return rejectWithValue("No guardian email found");
    }

    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`/parent/api/children?say=${say}`);
      return data?.children;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Thunk to fetch attendance
export const fetchAttendance = createAsyncThunk(
  "children/fetchAttendance",
  async ({ studentId, month, year }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(
        `/api/studentDashboard/myAttendance?studentId=${studentId}&month=${month}&year=${year}&say=${say}`
      );
      return data.report?.report;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Thunk to fetch teachers
export const fetchTeachers = createAsyncThunk(
  "children/fetchTeachers",
  async (studentId, { rejectWithValue, dispatch }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData || !userData.email) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("No guardian email found"));
      return rejectWithValue("No guardian email found");
    }

    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(
        `/parent/api/instructors/${studentId}?say=${say}`
      );

      return data?.instructors || [];
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Thunk to fetch grades
export const fetchGrades = createAsyncThunk(
  "children/fetchGrades",
  async ({ studentId }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(
        `/api/studentDashboard/subjects/${studentId}?say=${say}`
      );
      return data.grades;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Thunk to fetch modules
export const fetchModules = createAsyncThunk(
  "children/fetchModules",
  async (
    { studentId, subjectId, presentClassId },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`/admin/parent/classes/${presentClassId}/modules/${subjectId}/studentId/${studentId}?say=${say}`);
     console.log("mmm------->>>",data)
      return data?.data?.modules;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Thunk to fetch subjects
export const fetchSubjects = createAsyncThunk(
  "children/fetchSubjects",
  async (studentId, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(
        `/admin/course/subjects/student/${studentId}?say=${say}`
      );
      return data.subjects;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
