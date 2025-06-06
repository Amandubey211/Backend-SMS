import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ErrorMsg,
  handleError,
} from "../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../Common/Alerts/alertsSlice";
import toast from "react-hot-toast";
import { getAY } from "../../../../Utils/academivYear";
import { postData, putData, getData, deleteData } from "../../../../services/apiEndpoints";
import { getUserRole } from "../../../../Utils/getRoles";

// Existing: Create Timetable
export const createTimeTable = createAsyncThunk(
  "admin/createTimeTable",
  async (timetableData, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const academicYearId = getAY();
      const response = await postData(
        `/${getRole}/ascTimeTable/create?say=${academicYearId}`,
        timetableData
      );
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to create timetable");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Existing: Update Timetable
export const updateTimeTable = createAsyncThunk(
  "admin/updateTimeTable",
  async ({ id,timetableData }, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/ascTimeTable/update/${id}`,
        timetableData
      );
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to update timetable");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch all school timeTable
export const getSchoolTimeTable = createAsyncThunk(
  "admin/getSchoolTimeTable",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const response = await getData(
        `/${getRole}/ascTimeTable/school?say=${say}`,
         );
          return response; // Return the data array from the response
    } catch (error) {
      toast.error(error.message || "Failed to fetch class timetables");
      return handleError(error, dispatch, rejectWithValue);
    }
  })
// New: Fetch All Timetables for School
export const fetchAllTimeTables = createAsyncThunk(
  "admin/fetchAllTimeTables",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const response = await getData(`/${getRole}/ascTimeTable/school`);
      return response; // Return the data array from the response
    } catch (error) {
      toast.error(error.message || "Failed to fetch timetables");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// New: Fetch Timetables for a Class
export const fetchTimeTablesForClass = createAsyncThunk(
  "admin/fetchTimeTablesForClass",
  async ({ classId, sectionId }, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const response = await getData(
        `/${getRole}/ascTimeTable/class?classId=${classId}&sectionId=${sectionId}`
      );
      return response; // Return the data array from the response
    } catch (error) {
      toast.error(error.message || "Failed to fetch class timetables");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// New: Fetch Timetables for a Teacher
export const fetchTimeTablesForTeacher = createAsyncThunk(
  "admin/fetchTimeTablesForTeacher",
  async ({ teacherId }, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const response = await getData(
        `/admin/ascTimeTable/teacher/${teacherId}`
      );
      return response; // Return the data array from the response
    } catch (error) {
      toast.error(error.message || "Failed to fetch teacher timetables");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// New: Delete Timetable
export const deleteTimeTable = createAsyncThunk(
  "admin/deleteTimeTable",
  async ({ id }, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const response = await deleteData(`/${getRole}/ascTimeTable/${id}`);
      return { id }; // Return the deleted timetable ID for state updates
    } catch (error) {
      toast.error(error.message || "Failed to delete timetable");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch class timeTable
export const getClassTimeTable = createAsyncThunk(
  "admin/getClassTimeTable",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      console.log(getRole)
      const { classId, sectionId } = data;
      const response = await getData(
        `/${getRole}/ascTimeTable/class?say=${say}&classId=${classId}&sectionId=${sectionId}`
      );
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to load timetable");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
)
