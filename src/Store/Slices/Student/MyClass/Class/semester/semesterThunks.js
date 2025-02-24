import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../../../Utils/academivYear";
import { handleError } from "../../../../Common/Alerts/errorhandling.action";
import { getData } from "../../../../../../services/apiEndpoints";

// Fetch semesters for the selected class (classId derived from state)
export const fetchSemestersByClass = createAsyncThunk(
  "semesters/fetchSemestersByClass",
  async (cid, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const response = await getData(
        `/admin/get-semester?classId=${cid}&say=${say}`
      );
      if (response && response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to fetch semesters");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
