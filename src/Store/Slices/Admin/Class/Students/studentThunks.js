import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  ErrorMsg,
  handleError,
} from "../../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";
import { getData, putData } from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";

// Fetch students by class and section
export const fetchStudentsByClassAndSection = createAsyncThunk(
  "students/fetchStudentsByClassAndSection",
  async (classId, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(`/admin/student/${classId}?say=${say}`);
      console.log(response.data, "dddd");
      return response.data; // Ensure the structure is correct
    } catch (error) {
      console.error("Error in thunk:", error); // Debugging
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchStudentsByClassAndSectionNames = createAsyncThunk(
  "students/fetchByClassAndSectionNames",
  async (classId, { rejectWithValue, dispatch, getState }) => {
    try {
      console.log("payload", classId);
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(
        `/admin/all/student/${classId}?say=${say}`
      );
      console.log("fetchStudentsByClassAndSectionNames", response);
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch all students
export const fetchAllStudents = createAsyncThunk(
  "students/fetchAll",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(`/admin/all/students?say=${say}`);
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Promote Students
export const promoteStudents = createAsyncThunk(
  "students/promoteStudents",
  async (
    { StudentIds, promotionClassId, academicYearId },
    { getState, rejectWithValue, dispatch }
  ) => {
    const classId = getState().common.user.classInfo.selectedClassId;

    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await putData(
        `/${getRole}/promote/students?say=${say}`,
        {
          StudentIds,
          promotionClassId,
          academicYearId,
        }
      );
      toast.success("Student Promoted");
      dispatch(fetchStudentsByClassAndSection(classId));
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Promote Students in Same Class
export const promoteInSameClassStudents = createAsyncThunk(
  "students/promoteInSameClass",

  async (
    { studentIds, academicYearId },
    { rejectWithValue, dispatch, getState }
  ) => {
    const classId = getState().common.user.classInfo.selectedClassId;
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await putData(
        `/${getRole}/promote/inSameClass/students?say=${say}`,
        { studentIds, academicYearId }
      );
      dispatch(fetchStudentsByClassAndSection(classId));
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Graduate Students
export const graduateStudents = createAsyncThunk(
  "students/graduateStudents",
  async ({ studentIds }, { getState, rejectWithValue, dispatch }) => {
    const classId = getState().common.user.classInfo.selectedClassId;
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await putData(
        `/${getRole}/graduate/students?say=${say}`,
        {
          studentIds,
        }
      );
      if (response.success) {
        toast.success("Student graduated successfully");
      } else {
        toast.success(response.message);
      }
      // toast.success("Student Graduated");
      dispatch(fetchStudentsByClassAndSection(classId));
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Demote Students
export const demoteStudents = createAsyncThunk(
  "students/demoteStudents",
  async ({ studentIds }, { getState, rejectWithValue, dispatch }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await putData(`/${getRole}/demote/students?say=${say}`, {
        studentIds,
      });
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Graduates
export const fetchGraduates = createAsyncThunk(
  "students/fetchGraduates",
  async (queryParams, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(
        `/${getRole}/graduates/students?say=${say}`,
        {
          queryParams,
        }
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
