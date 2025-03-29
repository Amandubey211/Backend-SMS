import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import {
  ErrorMsg,
  handleError,
} from "../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../Utils/academivYear";
import { getData } from "../../../../services/apiEndpoints";

// Fetch library books thunk
export const fetchLibraryBooks = createAsyncThunk(
  "library/fetchLibraryBooks",
  async ({
    page = 1,
    limit = 5,
    search = "",
    childId,
    status="All"
  }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`/parent/all/bookIssue?say=${say}&page=${page}&limit=${limit}&search=${search}&studentId=${childId}&status=${status}`);
      console.log('data',data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
