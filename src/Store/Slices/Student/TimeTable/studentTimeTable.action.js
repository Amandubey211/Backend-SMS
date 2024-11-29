import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getData } from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";
import { setShowError } from "../../Common/Alerts/alertsSlice";

// Fetch Student Timetable
export const fetchStudentTimetable = createAsyncThunk(
  "studentTimetable/fetchStudentTimetable",
  async (_, { rejectWithValue, dispatch }) => {

    try {
      const say = getAY()
      dispatch(setShowError(false));
      const response = await getData(
        `/student/timetable?say=${say}`
      );

      // console.log('API Response:', response);  // Log the response to verify structure
      return response; // Ensure response is in the expected format
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
