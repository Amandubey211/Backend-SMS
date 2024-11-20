import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../../Utils/academivYear";
import { getData } from "../../../../../services/apiEndpoints";
import { setSelectedClassName } from "../../../Common/User/reducers/userSlice";

export const stdClass = createAsyncThunk(
  "class/studentClass",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const res = await getData(`/student/my_class?say=${say}`);
      console.log("data in action class :", res?.data);
      const data = res?.data;
      dispatch(setSelectedClassName(data?.className));
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
