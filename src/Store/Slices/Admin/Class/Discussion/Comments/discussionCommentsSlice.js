import { createSlice } from "@reduxjs/toolkit";
import {
  fetchComments,
  addComment,
  addReply,
  deleteComment,
  deleteReply,
  toggleLikeMessage,
} from "./commentsThunks";

const discussionCommentsSlice = createSlice({
  name: "discussionComments",
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
    resetActiveReplyId: (state) => {
      state.activeReplyId = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch comments
    builder.addCase(fetchComments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.loading = false;
      state.comments = action.payload;
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add a comment
    builder.addCase(addComment.fulfilled, (state, action) => {
      state.comments = [action.payload, ...state.comments]; // Optimistic update
    });

    // Add a reply
    builder.addCase(addReply.fulfilled, (state, action) => {
      const { parentId, reply } = action.payload;
      const parentComment = state.comments.find(
        (comment) => comment._id === parentId
      );
      if (parentComment) {
        parentComment.replies = [reply, ...parentComment.replies]; // Optimistic update
      }
    });

    // Delete a comment
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment._id !== action.payload
      );
    });

    // Delete a reply
    builder.addCase(deleteReply.fulfilled, (state, action) => {
      state.comments = state.comments?.map((comment) => ({
        ...comment,
        replies: comment.replies.filter(
          (reply) => reply._id !== action.payload
        ),
      }));
    });

    // Toggle like
    builder.addCase(toggleLikeMessage.fulfilled, (state, action) => {
      const messageId = action.payload;
      state.comments = state.comments?.map((comment) => {
        if (comment._id === messageId) {
          const isLiked = comment.likes.some(
            (like) => like.userId === "currentUserId"
          );
          comment.likes = isLiked
            ? comment.likes.filter((like) => like.userId !== "currentUserId")
            : [...comment.likes, { userId: "currentUserId" }];
        }
        return comment;
      });
    });
  },
});

export const { setActiveReplyId, resetActiveReplyId } =
  discussionCommentsSlice.actions;
export default discussionCommentsSlice.reducer;
