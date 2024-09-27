// src/Store/Slices/Admin/Announcements/announcementSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAnnouncementsThunk,
  createAnnouncementThunk,
  updateAnnouncementThunk,
  deleteAnnouncementThunk,
} from "./announcementThunk";

const initialState = {
  notices: [],
  selectedNotice: null,
  editMode: false,
  loading: false,
  error: null,
};

const announcementSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    setSelectedNotice: (state, action) => {
      state.selectedNotice = action.payload;
    },
    setEditMode: (state, action) => {
      state.editMode = action.payload;
    },
    resetEditMode: (state) => {
      state.editMode = false;
      state.selectedNotice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Announcements
      .addCase(fetchAnnouncementsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncementsThunk.fulfilled, (state, action) => {
        state.notices = action.payload;
        state.loading = false;
      })
      .addCase(fetchAnnouncementsThunk.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // Create Announcement
      .addCase(createAnnouncementThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnnouncementThunk.fulfilled, (state, action) => {
        state.notices.push(action.payload);
        state.loading = false;
      })
      .addCase(createAnnouncementThunk.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // Update Announcement
      .addCase(updateAnnouncementThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAnnouncementThunk.fulfilled, (state, action) => {
        const index = state.notices.findIndex(
          (notice) => notice._id === action.payload._id
        );
        if (index !== -1) {
          state.notices[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateAnnouncementThunk.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // Delete Announcement
      .addCase(deleteAnnouncementThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnnouncementThunk.fulfilled, (state, action) => {
        state.notices = state.notices.filter(
          (notice) => notice._id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteAnnouncementThunk.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

// Export actions
export const { setSelectedNotice, setEditMode, resetEditMode } =
  announcementSlice.actions;

// Export reducer
export default announcementSlice.reducer;
