import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData } from "../../../../services/apiEndpoints";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";

export const getAllRoutes = createAsyncThunk(
  "routes/transportationRoutes",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await getData(`/transport/route/school`);
      return data;
    } catch (error) {
      console.error("Error in transportRoutes:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const getRouteById =  createAsyncThunk(
    "transportRoute/getRouteById",
    async (id, { rejectWithValue, dispatch }) => {
      try {
        dispatch(setShowError(false));
        const data = await getData(`/transport/route/${id}`);
        // console.log("stttttt===>",data.data)
        return data;
      } catch (error) {
        console.error("Error in transportRouteBy Id:", error);
        handleError(error, dispatch, rejectWithValue);
      }
    }
  );



