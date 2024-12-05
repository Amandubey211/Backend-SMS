import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData, putData } from "../../../../../services/apiEndpoints"; // Adjust the path as necessary
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";

export const fetchAssignedAssignmentStudents = createAsyncThunk(
  "speedGrade/fetchAssignedAssignmentStudents",
  async (assignmentId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/speed_grade/students/${assignmentId}?say=${say}`;
     
      const response = await getData(endpoint);

      if (response && response.success) {
        return response.data; // Assuming 'data' contains the list of assigned students
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchStudentAssignment = createAsyncThunk(
  "speedGrade/fetchStudentAssignment",
  async ({ studentId, assignmentId }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/speed_grade/assignment?say=${say}&studentId=${studentId}&assignmentId=${assignmentId}`;
     
      const response = await getData(endpoint);

      if (response && response.success) {
        return response.data; // Assuming 'data' contains the student's assignment details
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const assignAssignmentGrade = createAsyncThunk(
  "speedGrade/assignAssignmentGrade",
  async (
    { studentId, assignmentId, grade, attemptDate, status },
    { rejectWithValue, dispatch }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/speed_grade/grade?say=${say}`;
     
      const requestBody = {
        studentId,
        assignmentId,
        grade,
        attemptDate,
        status,
      };
      const response = await putData(endpoint, requestBody);

      if (response && response.success) {
        toast.success("Grade Assigned");
        dispatch(fetchStudentAssignment({ studentId, assignmentId }));
        return response.data; // Assuming 'data' contains the updated assignment data
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
