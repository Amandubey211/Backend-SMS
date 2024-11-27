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

      return response?.data?.timetables; // Return the timetables from the response
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
