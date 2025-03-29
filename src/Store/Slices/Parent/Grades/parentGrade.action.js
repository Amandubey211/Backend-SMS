// parentGrade.action.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getUserRole } from "../../../../Utils/getRoles";
import { getData } from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";

export const fetchParentStudentGrades = createAsyncThunk(
  "parent/grades/fetchStudentGrades",
  async ({ params, studentId, studentClassId, semesterId }, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const say = getAY();

      // Keep semesterId in the query string:
      const endpoint = `/${getRole}/grades/student/${studentId}/class/${studentClassId}?say=${say}&semesterId=${semesterId}`;

      // NOTE: "params" will no longer contain "semesterId"
      const response = await getData(endpoint, params);
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
