import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData } from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";

export const studentIssueBooks = createAsyncThunk(
  "books/studentIssueBooks",
  async ({page,limit}, { rejectWithValue, dispatch }) => {
    try {
      const say=getAY();
      dispatch(setShowError(false));
      const data = await getData(`/student/issue/books?say=${say}&page=${page}&limit=${limit}`);
      return data;
    } catch (error) {
      console.error("Error in studentIssueBooks:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
