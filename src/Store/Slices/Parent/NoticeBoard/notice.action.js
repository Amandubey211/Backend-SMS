import { createAsyncThunk } from "@reduxjs/toolkit";
import { } from "../../../../config/Common";
import {  setShowError } from "../../Common/Alerts/alertsSlice";
import {
  handleError,
} from "../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../Utils/academivYear";
import { getData } from "../../../../services/apiEndpoints";


// Async thunk to fetch all notices
export const fetchAllNotices = createAsyncThunk(
  "dashboard/fetchNotices",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`/admin/all/notices?say=${say}`);
      return data?.notices;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
