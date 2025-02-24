import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../Utils/academivYear";
import { getData } from "../../../../services/apiEndpoints";
import { getUserRole } from "../../../../Utils/getRoles";

// ✅ Thunk for fetching semesters by class (updated endpoint path)
export const fetchSemestersByClass = createAsyncThunk(
  "parent/semesters",
  async ({ classId }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY(); // Get Academic Year
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState); // Dynamically get user role
      const endpoint = `/${getRole}/get-semester?classId=${classId}&say=${say}`;  // <-- Updated API path

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

// ✅ Alias fetchSemestersByClass as fetchSemesters
export const fetchSemesters = fetchSemestersByClass;  // <-- Added this line
