import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setTeacherAssign,
  setTeachers,
  filterTeachersBySection,
} from "./teacherSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../../Utils/academivYear";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";
import toast from "react-hot-toast";

// Fetch all teachers
export const fetchAllTeachers = createAsyncThunk(
  "teachers/fetchAllTeachers",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(`/${getRole}/teacher?say=${say}`);
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
  async (classId, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const { data } = await getData(`/${getRole}/teacherByClass?say=${say}`, {
        id: classId,
      });
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
  async (assignData, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await postData(
        `/${getRole}/teacher?say=${say}`,
        assignData
      );
      if (response.success) {
        dispatch(fetchTeachersByClass(assignData.classId));
        return response.data || [];
      } else {
        toast.error(response.message || "Teacher Not Assigned, Try again!");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Unassign teacher from a class
export const unassignTeacher = createAsyncThunk(
  "teacher/unassignTeacher",
  async ({ teacherId, classId }, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      await deleteData(
        `/${getRole}/teacher/${teacherId}/class/${classId}?say=${say}`
      );
      dispatch(fetchTeachersByClass(classId));
      return teacherId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Edit teacher details
export const editTeacher = createAsyncThunk(
  "teacher/editTeacher",
  async (editData, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();

      // Send the update request using PUT
      const response = await putData(
        `/${getRole}/teacher/${editData.id}?say=${say}`,
        {
          subjects: editData.subjects,
          classIds: editData.classIds,
          sectionIds: editData.sectionIds,
        }
      );

      // Extract class id from editData (assuming the first class in the array is used)
      const classId = editData.classIds?.[0]?._id;
      if (classId) {
        dispatch(fetchTeachersByClass(classId));
      }
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
