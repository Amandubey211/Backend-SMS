// parentSemester.action.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../Utils/academivYear";
import { getData } from "../../../../services/apiEndpoints";
import { setSelectedSemester } from "./parentSemesterSlice";

// ✅ Thunk for fetching semesters by class (Force /admin route)
export const fetchSemestersByClass = createAsyncThunk(
  "parent/semesters",
  async ({ classId }, { rejectWithValue, dispatch }) => {
    dispatch(setShowError(false));

    try {
      const say = getAY();

      const endpoint = `/admin/get-semester?classId=${classId}&say=${say}`;
      const response = await getData(endpoint);
      dispatch(setSelectedSemester(response?.data[response?.data?.length - 1]));
      return response.data; // Return semesters array
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
