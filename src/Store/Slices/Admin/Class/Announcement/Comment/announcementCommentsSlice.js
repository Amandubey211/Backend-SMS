import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAnnouncementComments,
  addAnnouncementComment,
  addAnnouncementReply,
  deleteAnnouncementComment,
  toggleLikeAnnouncementComment,
} from "./announcementCommentsThunks";

const announcementCommentsSlice = createSlice({
  name: "announcementComments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
    activeReplyId: null,
  },
  reducers: {
    setActiveReplyId: (state, action) => {
      state.activeReplyId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchAnnouncementComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncementComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchAnnouncementComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Comment
      .addCase(addAnnouncementComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })

      // Add Reply
      .addCase(addAnnouncementReply.fulfilled, (state, action) => {
        const { parentId, reply } = action.payload;
        const parentComment = state.comments.find(
          (comment) => comment._id === parentId
        );
        if (parentComment) {
          parentComment.replies.push(reply);
        }
      })

      // Delete Comment
      .addCase(deleteAnnouncementComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      })

      // Toggle Like
      .addCase(toggleLikeAnnouncementComment.fulfilled, (state, action) => {
        const comment = state.comments.find(
          (comment) => comment._id === action.payload
        );
        if (comment) {
          const isLiked = comment.likes.some(
            (like) => like.userId === "currentUserId"
          );
          if (isLiked) {
            comment.likes = comment.likes.filter(
              (like) => like.userId !== "currentUserId"
            );
          } else {
            comment.likes.push({ userId: "currentUserId" });
          }
        }
      });
  },
});

export const { setActiveReplyId } = announcementCommentsSlice.actions;
export default announcementCommentsSlice.reducer;
