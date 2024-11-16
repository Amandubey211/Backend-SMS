import { createSlice } from "@reduxjs/toolkit";
import {
  createStudentAnnounceComment,
  createStudentAnnounceReply,
  editStudentAnnounceComment,
  editStudentAnnounceReply,
  fetchStudentAnnounce,
  fetchStudentAnnounceById,
  fetchStudentAnnounceComments,
} from "./announcement.action";

const initialState = {
  announcementData: [],
  announcement: null,
  isSidebarOpen: false,
  loading: false,
  error: null,
  comments: [],
  loadingComments: false,
  errorComments: null,
};

const announcementSlice = createSlice({
  name: "student/discussionSlice",
  initialState,
  reducers: {
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentAnnounce.pending, (state, action) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchStudentAnnounce.fulfilled, (state, action) => {
        state.loading = false;
        state.announcementData = action.payload;
      })
      .addCase(fetchStudentAnnounce.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchStudentAnnounceById.pending, (state, action) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchStudentAnnounceById.fulfilled, (state, action) => {
        state.loading = false;
        state.announcement = action.payload;
      })
      .addCase(fetchStudentAnnounceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchStudentAnnounceComments.pending, (state) => {
        state.loadingComments = true;
        state.errorComments = null;
      })
      .addCase(fetchStudentAnnounceComments.fulfilled, (state, action) => {
        state.loadingComments = false;
        state.comments = action.payload;
      })
      .addCase(fetchStudentAnnounceComments.rejected, (state, action) => {
        state.loadingComments = false;
        state.errorComments = action.payload;
      });

    builder
      .addCase(createStudentAnnounceComment.pending, (state) => {
        state.loadingComments = true;
        state.errorComments = null;
      })
      .addCase(createStudentAnnounceComment.fulfilled, (state, action) => {
        state.loadingComments = false;
        state.comments.push(action.payload);
      })
      .addCase(createStudentAnnounceComment.rejected, (state, action) => {
        state.loadingComments = false;
        state.errorComments = action.payload;
      });

    builder.addCase(editStudentAnnounceComment.fulfilled, (state, action) => {
      const index = state.comments.findIndex(
        (comment) => comment._id === action.payload._id
      );
      if (index !== -1) {
        state.comments[index] = action.payload; // Update comment
      }
    });

    builder.addCase(editStudentAnnounceReply.fulfilled, (state, action) => {
      const index = state.comments.findIndex(
        (comment) => comment._id === action.payload._id
      );
      if (index !== -1) {
        state.comments[index] = action.payload; // Update comment
      }
    });

    builder.addCase(createStudentAnnounceReply.fulfilled, (state, action) => {
      const { parentId } = action.payload;

      // Find the parent comment or reply where this reply should go
      const parentCommentOrReply = findCommentOrReply(state.comments, parentId);

      if (parentCommentOrReply) {
        parentCommentOrReply.replies.push(action.payload);
      }
    });
  },
});

const findCommentOrReply = (comments, parentId) => {
  for (let comment of comments) {
    if (comment._id === parentId) {
      return comment;
    }
    if (comment.replies && comment.replies.length > 0) {
      const foundReply = findCommentOrReply(comment.replies, parentId);
      if (foundReply) return foundReply;
    }
  }
  return null;
};

export const { setSidebarOpen } = announcementSlice.actions;
export default announcementSlice.reducer;
