import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setTeacherAssign,
  setTeachers,
  filterTeachersBySection,
} from "./teacherSlice";
import { ErrorMsg, handleError } from "../../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../../Utils/academivYear";
import { deleteData, getData, putData } from "../../../../../services/apiEndpoints";


// Fetch all teachers
export const fetchAllTeachers = createAsyncThunk(
  "teachers/fetchAllTeachers",
  async (_, { rejectWithValue,  dispatch }) => {
    try {
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(`/admin/teacher?say=${say}`);
      dispatch(setTeachers(response.data));
      dispatch(filterTeachersBySection());
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch teachers by class
export const fetchTeachersByClass = createAsyncThunk(
  "teachers/fetchByClass",
  async (classId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const say = getAY()
      const  {data} = await getData(
        `/admin/teacherByClass?say=${say}`,
     { id: classId },
         
      );
      dispatch(setTeacherAssign(data));
      dispatch(filterTeachersBySection());
      return data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Assign teacher to a class
export const assignTeacher = createAsyncThunk(
  "teacher/assignTeacher",
  async (assignData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const say = getAY()
      const response = await putData(
        `/admin/teacher?say=${say}`,
        assignData
      );
      dispatch(fetchTeachersByClass(assignData.classId));
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Unassign teacher from a class
export const unassignTeacher = createAsyncThunk(
  "teacher/unassignTeacher",
  async ({ teacherId, classId }, { rejectWithValue,  dispatch }) => {
    try {
      dispatch(setShowError(false));
      const say = getAY()
      await deleteData(
        `/admin/teacher/${teacherId}/class/${classId}?say=${say}`
       
      );
      dispatch(fetchTeachersByClass(classId));
      return teacherId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
