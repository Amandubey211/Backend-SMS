// src/Store/Slices/Event/eventThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";

// Fetch events
export const fetchEventsThunk = createAsyncThunk(
  "events/fetchEvents",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { common } = getState(); // Get state
      const token = common.auth.token; // Extract token
      const response = await axios.get(`${baseUrl}/admin/all/events`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      return response.data.events;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch events"
      );
    }
  }
);

// Create event
export const createEventThunk = createAsyncThunk(
  "events/createEvent",
  async (eventData, { getState, rejectWithValue, dispatch }) => {
    try {
      const { common } = getState(); // Get state
      const token = common.auth.token; // Extract token

      const formData = new FormData();
      Object.keys(eventData).forEach((key) => {
        if (eventData[key]) formData.append(key, eventData[key]);
      });

      const response = await axios.post(
        `${baseUrl}/admin/create_event`,
        formData,
        {
          headers: {
            Authentication: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(fetchEventsThunk());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to create event"
      );
    }
  }
);

// Update event
export const updateEventThunk = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, eventData }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { common } = getState(); // Get state
      const token = common.auth.token; // Extract token

      const formData = new FormData();
      Object.keys(eventData).forEach((key) => {
        if (eventData[key]) formData.append(key, eventData[key]);
      });

      const response = await axios.put(
        `${baseUrl}/admin/update/event/${eventId}`,
        formData,
        {
          headers: {
            Authentication: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(fetchEventsThunk());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to update event"
      );
    }
  }
);

// Delete event
export const deleteEventThunk = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { getState, rejectWithValue, dispatch }) => {
    try {
      const { common } = getState(); // Get state
      const token = common.auth.token; // Extract token

      await axios.delete(`${baseUrl}/admin/delete/event/${eventId}`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      dispatch(fetchEventsThunk());
      return eventId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to delete event"
      );
    }
  }
);
