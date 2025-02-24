// parentSemester.action.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../Utils/academivYear";
import { getData } from "../../../../services/apiEndpoints";

// ✅ Thunk for fetching semesters by class (Force /admin route)
export const fetchSemestersByClass = createAsyncThunk(
  "parent/semesters",
  async ({ classId }, { rejectWithValue, dispatch }) => {
    dispatch(setShowError(false));

    try {
      const say = getAY(); 

      const endpoint = `/admin/get-semester?classId=${classId}&say=${say}`;

      const response = await getData(endpoint);

      if (response && response.success) {
        return response.data; // Return semesters array
      } else {
        return rejectWithValue(response?.message || "Failed to fetch semesters.");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// ✅ Optional alias if needed
export const fetchSemesters = fetchSemestersByClass;
