import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAnnouncements,
  markAsReadAnnouncement,
  fetchAnnouncementById,
  deleteAnnouncement,
  createAnnouncement,
  editAnnouncement,
} from "./announcementThunk";

const initialState = {
  announcements: [], // List of all announcements
  announcement: null, // Single announcement when viewing/editing
  loading: false, // General loading state
  error: null, // General error state
};

const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all announcements
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Mark announcement as read
    builder.addCase(markAsReadAnnouncement.fulfilled, (state, action) => {
      state.announcements = state.announcements.map((announcement) =>
        announcement._id === action.payload
          ? { ...announcement, isRead: true }
          : announcement
      );
    });

    // Fetch a single announcement by ID
    builder
      .addCase(fetchAnnouncementById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncementById.fulfilled, (state, action) => {
        state.loading = false;
        state.announcement = action.payload;
      })
      .addCase(fetchAnnouncementById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete an announcement
    builder
      .addCase(deleteAnnouncement.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = state.announcements.filter(
          (announcement) => announcement._id !== action.payload
        );
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create an announcement
    builder
      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements.push(action.payload);
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Edit an announcement
    builder
      .addCase(editAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = state.announcements.map((announcement) =>
          announcement._id === action.payload._id
            ? action.payload
            : announcement
        );
      })
      .addCase(editAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default announcementSlice.reducer;
