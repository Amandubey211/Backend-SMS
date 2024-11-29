// src/Store/Slices/Event/eventSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchEventsThunk,
  createEventThunk,
  updateEventThunk,
  deleteEventThunk,
} from "./eventThunks";

const initialState = {
  events: [],
  loading: false,
  error: null,
  deleteLoading: false,
  selectedEvent: null, // Used for viewing/updating
  sidebarContent: null,
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setSelectedEvent: (state, action) => {
      // console.log("Selected Event: ", action.payload); //
      state.selectedEvent = action.payload;
    },
    resetSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
    setSidebarContent(state, action) {
      // console.log("Selected content: ", action.payload); //

      state.sidebarContent = action.payload;
    },
    resetSidebarContent(state) {
      state.sidebarContent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEventsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEventsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create event
      .addCase(createEventThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEventThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEventThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update event
      .addCase(updateEventThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEventThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEventThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete event
      .addCase(deleteEventThunk.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteEventThunk.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.events = state.events.filter(
          (event) => event._id !== action.payload
        );
      })
      .addCase(deleteEventThunk.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setSelectedEvent,
  resetSelectedEvent,
  setSidebarContent,
  resetSidebarContent,
} = eventSlice.actions;

export default eventSlice.reducer;
