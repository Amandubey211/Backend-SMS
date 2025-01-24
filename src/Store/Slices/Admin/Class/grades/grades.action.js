import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../Utils/academivYear";
import { getData } from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";

// Thunk for fetching subject grades
export const fetchSubjectGrades = createAsyncThunk(
  "subject/grades",
  async (
    { classId, subjectId, filters },
    { rejectWithValue, dispatch, getState }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const endpoint = `/${getRole}/grades/class/${classId}/subject/${subjectId}?say=${say}`;

      const response = await getData(endpoint, filters);

      if (response && response.gradesResult) {
        return response.gradesResult;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
