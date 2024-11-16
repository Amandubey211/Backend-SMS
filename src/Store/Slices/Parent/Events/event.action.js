import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import { ErrorMsg, handleError } from "../../Common/Alerts/errorhandling.action";
import { getData } from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";
const say = localStorage.getItem('say');

// Fetch all events
export const fetchAllEvents = createAsyncThunk(
  "events/fetchAll",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`/admin/all/events?say=${say}`);
      return data?.events;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
