import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData } from "../../../../services/apiEndpoints";
import { stdBookIssued } from "../../../../Utils/EndpoinUrls/stdEndpointUrl";

export const studentIssueBooks = createAsyncThunk(
  "books/studentIssueBooks",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await getData(stdBookIssued);
      return data;
    } catch (error) {
      console.error("Error in studentIssueBooks:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
