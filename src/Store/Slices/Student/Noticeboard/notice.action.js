import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData } from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";

export const studentNotice = createAsyncThunk(
  "announcement/studentNotice",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const say=getAY();
      dispatch(setShowError(false));
      const data = await getData(`/admin/all/notices?say=${say}`);
      const formatedData = data?.notices?.map((notice) => ({
        ...notice,
        startDate: new Date(notice.startDate),
        endDate: new Date(notice.endDate),
      }));
      return formatedData;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
