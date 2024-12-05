import { createSlice } from "@reduxjs/toolkit";
import {
  fetchClassDiscussions,
  fetchDiscussionById,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  markAsReadDiscussion,
  updatePinStatus,
} from "./discussionThunks";

const discussionSlice = createSlice({
  name: "discussions",
  initialState: {
    discussions: [],
    discussion: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetDiscussion: (state) => {
      state.discussion = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all discussions
      .addCase(fetchClassDiscussions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassDiscussions.fulfilled, (state, action) => {
        state.loading = false;
        state.discussions = action.payload;
      })
      .addCase(fetchClassDiscussions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch a single discussion
      .addCase(fetchDiscussionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscussionById.fulfilled, (state, action) => {
        state.loading = false;
        state.discussion = action.payload;
      })
      .addCase(fetchDiscussionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create discussion
      .addCase(createDiscussion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDiscussion.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createDiscussion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update discussion
      .addCase(updateDiscussion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDiscussion.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateDiscussion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete discussion
      .addCase(deleteDiscussion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDiscussion.fulfilled, (state, action) => {
        state.loading = false;
        state.discussions = state.discussions.filter(
          (discussion) => discussion._id !== action.payload
        );
      })
      .addCase(deleteDiscussion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark as read
      .addCase(markAsReadDiscussion.fulfilled, (state, action) => {
        const updatedDiscussion = action.payload;
      })
      // Update pin status
      .addCase(updatePinStatus.fulfilled, (state, action) => {
        const updatedDiscussion = action.payload;
      });
  },
});

export const { resetDiscussion } = discussionSlice.actions;
export default discussionSlice.reducer;
