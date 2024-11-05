import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";

const say = localStorage.getItem("say");

// Helper function to get the token from Redux state
const getToken = (state, rejectWithValue, dispatch) => {
  const token = state.common.auth?.token;
  if (!token) {
    dispatch(setShowError(true));
    dispatch(setErrorMsg("Authentication Failed"));
    return rejectWithValue("Authentication Failed");
  }
  return `Bearer ${token}`;
};

// Centralized error handling
const handleError = (error, dispatch, rejectWithValue) => {
  const err = ErrorMsg(error);
  dispatch(setShowError(true));
  dispatch(setErrorMsg(err.message));
  return rejectWithValue(err.message);
};

// Fetch events
export const fetchEventsThunk = createAsyncThunk(
  "events/fetchEvents",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.get(`${baseUrl}/admin/all/events?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data.events;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Create event
export const createEventThunk = createAsyncThunk(
  "events/createEvent",
  async (eventData, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const formData = new FormData();
      Object.keys(eventData).forEach((key) => {
        if (eventData[key]) formData.append(key, eventData[key]);
      });

      const response = await axios.post(
        `${baseUrl}/admin/create_event?say=${say}`,
        formData,
        {
          headers: {
            Authentication: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(fetchEventsThunk());
      toast.success("Event created successfully!");
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update event
export const updateEventThunk = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, eventData }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const formData = new FormData();
      Object.keys(eventData).forEach((key) => {
        if (eventData[key]) formData.append(key, eventData[key]);
      });

      const response = await axios.put(
        `${baseUrl}/admin/update/event/${eventId}?say=${say}`,
        formData,
        {
          headers: {
            Authentication: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(fetchEventsThunk());
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete event
export const deleteEventThunk = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      await axios.delete(`${baseUrl}/admin/delete/event/${eventId}?say=${say}`, {
        headers: { Authentication: token },
      });

      dispatch(fetchEventsThunk());
      toast.success("Event deleted successfully!");
      return eventId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
