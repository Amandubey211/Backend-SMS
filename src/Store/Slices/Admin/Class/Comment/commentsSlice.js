import { createSlice } from "@reduxjs/toolkit";
import {
  fetchComments,
  addComment,
  addReply,
  deleteComment,
  toggleLikeComment,
} from "./commentsThunks";

const commentsSlice = createSlice({
  name: "comments",
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
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })

      // Add Reply
      .addCase(addReply.fulfilled, (state, action) => {
        const { parentId, reply } = action.payload;
        const parentComment = state.comments.find(
          (comment) => comment._id === parentId
        );
        if (parentComment) {
          parentComment.replies.push(reply);
        }
      })

      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      })

      // Toggle Like
      .addCase(toggleLikeComment.fulfilled, (state, action) => {
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

export const { setActiveReplyId } = commentsSlice.actions;
export default commentsSlice.reducer;
