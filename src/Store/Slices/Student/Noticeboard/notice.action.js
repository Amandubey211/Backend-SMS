import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData } from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";

export const studentNotice = createAsyncThunk(
  "announcement/studentNotice",
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
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
