import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData } from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";

export const studentNotice = createAsyncThunk(
  "announcement/studentNotice",
  async (
    { page, limit, search, priority },
    { rejectWithValue, dispatch }
  ) => {
    try {

      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(
        `/admin/all/notices?say=${say}&page=${page}&limit=${limit}&sortBy=startDate&sortOrder=desc&search=${search}&priority=${priority}`
      );
      console.log("notices action data", data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
