import { createAsyncThunk } from "@reduxjs/toolkit";
import { parseISO } from "date-fns";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData } from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";

export const stdEvent = createAsyncThunk(
  "event/studentEvents",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const say=getAY();
      dispatch(setShowError(false));
      const data = await getData(`/admin/all/events?say=${say}`);

      const formattedEvents = data?.events?.map((event, index) => ({
        ...event,
        id: index,
        startDate: parseISO(event.date),
        endDate: new Date(
          new Date(event.date).setHours(new Date(event.date).getHours() + 2)
        ),
      }));

      return formattedEvents;
    } catch (error) {
      // console.log("Error in std Event", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
