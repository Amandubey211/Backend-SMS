import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getData } from "../../../../services/apiEndpoints";

// Fetch Student Timetable
export const fetchStudentTimetable = createAsyncThunk(
  "studentTimetable/fetchStudentTimetable",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const { userId, userSchoolId } = getState().common.auth;
    const academicYear = getState().common.academicYear.selected || "";

    try {
      const response = await getData(
        `/student/timetable`,
        {
          params: {
            userId,
            userSchoolId,
            say: academicYear,
          },
        }
      );

      console.log('API Response:', response);  // Log the response to verify structure
      return response; // Ensure response is in the expected format
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
