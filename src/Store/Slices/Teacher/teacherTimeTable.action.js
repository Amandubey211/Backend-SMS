import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../Common/Alerts/errorhandling.action";
import { getAY } from "../../../Utils/academivYear";
import { getData } from "../../../services/apiEndpoints";
import { setShowError } from "../Common/Alerts/alertsSlice";

// Fetch Teacher Timetable
export const fetchTeacherTimetable = createAsyncThunk(
  "teacherTimetable/fetchTeacherTimetable",
  async (_, { rejectWithValue, dispatch }) => {

    try {
      const say = getAY(); // Get academic year
      dispatch(setShowError(false));
      // Build API query
      const response = await getData(`/teacher/timetable?say=${say}`);

      return response; // Return timetable data
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); // Handle errors
    }
  }
);
