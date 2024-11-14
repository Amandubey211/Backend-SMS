import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../../../Utils/academivYear";
import { getData } from "../../../../../../../services/apiEndpoints";

export const stdPages = createAsyncThunk(
  "pages/stdPages",
  async ({ classId }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const res = await getData(
        `/admin/api/pages/class/pages/${classId}?say=${say}`
      );
      const data = res?.data;
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchPageView = createAsyncThunk(
  "pages/pageView",
  async (pageId, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      const data = await getData(`/student/pages/${pageId}?say=${say}`);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
