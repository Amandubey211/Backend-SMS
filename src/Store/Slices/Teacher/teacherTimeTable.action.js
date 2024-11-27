import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../Common/Alerts/errorhandling.action";
import { getAY } from "../../../Utils/academivYear";
import { getData } from "../../../services/apiEndpoints";

// Fetch Teacher Timetable
export const fetchTeacherTimetable = createAsyncThunk(
  "teacherTimetable/fetchTeacherTimetable",
  async (filters = {}, { rejectWithValue, getState, dispatch }) => {
    try {
      const { userSchoolId } = getState().common.auth; // Fetch schoolId
      const say = getAY(); // Get academic year

      // Build API query
      const response = await getData(`/api/teacher/timetable?say=${say}`, {
        params: { userSchoolId, ...filters },
      });

      return response?.data; // Return timetable data
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); // Handle errors
    }
  }
);
