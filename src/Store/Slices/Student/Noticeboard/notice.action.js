import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData } from "../../../../services/apiEndpoints";
import { stdNotices } from "../../../../Utils/EndpoinUrls/stdEndpointUrl";

export const studentNotice = createAsyncThunk(
  "announcement/studentNotice",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await getData(stdNotices);
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
