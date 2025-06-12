import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../../../Utils/academivYear";
import { getData } from "../../../../../../../services/apiEndpoints";

export const stdModule = createAsyncThunk(
  "module/stdModule",
  async ({ cid, sid }, { rejectWithValue, dispatch, getState }) => {
    try {
      // console.log("hii");

      const semesterId = getState().common.user.classInfo.selectedSemester.id;
      const say = getAY();
      dispatch(setShowError(false));
      const res = await getData(
        `/admin/student/classes/${cid}/modules/${sid}?say=${say}&semesterId=${semesterId}`
      );
      const data = res?.data;
      // console.log("std module action--->", res);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
