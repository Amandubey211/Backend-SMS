import { createAsyncThunk } from "@reduxjs/toolkit";
import {} from "../../../../config/Common";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../Utils/academivYear";
import { getData } from "../../../../services/apiEndpoints";

// Async thunk to fetch all notices
export const fetchAllNotices = createAsyncThunk(
  "notice/fetchAllNotices",
  async (
    {
      page = 1,
      limit = 5,
      search = "",
      priority = "",
      sortOrder = "desc",
      sortBy = "startDate",
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(
        `/admin/all/notices?say=${say}&page=${page}&limit=${limit}&search=${search}&priority=${priority}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      return data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);