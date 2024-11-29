import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../../Utils/academivYear";
import { customRequest, deleteData, getData,} from "../../../../../services/apiEndpoints";

// Fetch events
export const fetchEventsThunk = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`/admin/all/events?say=${say}`);
      // console.log("response events--",response);

      return response?.events;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Create event
export const createEventThunk = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const formData = new FormData();
      Object.keys(eventData).forEach((key) => {
        if (eventData[key]) formData.append(key, eventData[key]);
      });

      const response = await customRequest("post",
        `/admin/create_event?say=${say}`,
        formData, { "Content-Type": "multipart/form-data" });

      dispatch(fetchEventsThunk());
      toast.success("Event created successfully!");
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update event
export const updateEventThunk = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, eventData }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const formData = new FormData();
      Object.keys(eventData).forEach((key) => {
        if (eventData[key]) formData.append(key, eventData[key]);
      });

      const response = await customRequest("put",
        `/admin/update/event/${eventId}?say=${say}`,
        formData, { "Content-Type": "multipart/form-data" });

      dispatch(fetchEventsThunk());
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete event
export const deleteEventThunk = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      await deleteData(`/admin/delete/event/${eventId}?say=${say}`);

      dispatch(fetchEventsThunk());
      toast.success("Event deleted successfully!");
      return eventId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
