import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../Utils/academivYear";
import { getData } from "../../../../../services/apiEndpoints";

// Thunk for fetching subject grades
export const fetchSubjectGrades = createAsyncThunk(
  "subject/grades",
  async ({ classId, subjectId, filters }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/grades/class/${classId}/subject/${subjectId}?say=${say}`;
      const params = { say, ...filters };

      const response = await getData(endpoint, { params });

      if (response && response.gradesResult) {
        return response.gradesResult;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
