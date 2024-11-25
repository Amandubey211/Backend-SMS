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
      const endpoint = `/admin/speed_grade/students/${assignmentId}`;
      const params = { say };
      const response = await getData(endpoint, { params });

      if (response && response.success) {
        return response.data; // Assuming 'data' contains the list of assigned students
      } else {
        throw new Error(
          response.message || "Failed to fetch assigned assignment students"
        );
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
      const endpoint = `/admin/speed_grade/assignment`;
      const params = { say, studentId, assignmentId };
      const response = await getData(endpoint, params);

      if (response && response.success) {
        return response.data; // Assuming 'data' contains the student's assignment details
      } else {
        throw new Error(
          response.message || "Failed to fetch student assignment"
        );
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
      const endpoint = `/admin/speed_grade/grade`;
      const params = { say };
      const requestBody = {
        studentId,
        assignmentId,
        grade,
        attemptDate,
        status,
      };
      const response = await putData(endpoint, requestBody, { params });

      if (response && response.success) {
        toast.success("Grade Assigned");
        dispatch(fetchStudentAssignment({ studentId, assignmentId }));
        return response.data; // Assuming 'data' contains the updated assignment data
      } else {
        throw new Error(
          response.message || "Failed to assign assignment grade"
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
