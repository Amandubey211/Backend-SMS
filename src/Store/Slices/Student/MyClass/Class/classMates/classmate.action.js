import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../../../Utils/academivYear";
import { getData } from "../../../../../../services/apiEndpoints";



export const stdClassmate = createAsyncThunk(
  "classmate/studentClassmate",
  async ({ classId }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const res = await getData(`/student/my_classmates/${classId}?say=${say}`);
      // console.log("Classmate data in action:", res?.data);
      const data = res?.data;
      return data;
    } catch (error) {
      console.error("Error in student classmate:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
