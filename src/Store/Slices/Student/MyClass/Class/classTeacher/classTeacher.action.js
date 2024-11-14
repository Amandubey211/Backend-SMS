import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../config/Common";
import {
  ErrorMsg,
  handleError,
} from "../../../../Common/Alerts/errorhandling.action";
import {
  setErrorMsg,
  setShowError,
} from "../../../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../../../Utils/academivYear";
import { getData } from "../../../../../../services/apiEndpoints";

const say = localStorage.getItem("say");

export const stdClassTeacher = createAsyncThunk(
  "classTeacher/stdClassTeacher",
  async ({ classId }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const res = await getData(`/student/my_teachers/${classId}?say=${say}`);
      console.log("Class teacher data:", res?.data);
      const data = res?.data;
      return data;
    } catch (error) {
      console.error("Error in fetching class teacher:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
