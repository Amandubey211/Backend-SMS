import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNoticesThunk,
  createNoticeThunk,
  updateNoticeThunk,
  deleteNoticeThunk,
} from "./noticeThunks";

const initialState = {
  notices: [],
  selectedNotice: null,
  editMode: false,
  loading: false,
  error: null,
  titleToDelete: "", // State to hold the title of the notice to be deleted
};

const noticeSlice = createSlice({
  name: "notice",
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
    setTitleToDelete: (state, action) => {
      state.titleToDelete = action.payload; // Set the title for the delete modal
    },
    resetTitleToDelete: (state) => {
      state.titleToDelete = ""; // Reset the title
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notices
      .addCase(fetchNoticesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNoticesThunk.fulfilled, (state, action) => {
        state.notices = action.payload;
        state.loading = false;
      })
      .addCase(fetchNoticesThunk.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // Create Notice
      .addCase(createNoticeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNoticeThunk.fulfilled, (state, action) => {
        state.notices.push(action.payload);
        state.loading = false;
      })
      .addCase(createNoticeThunk.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // Update Notice
      .addCase(updateNoticeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNoticeThunk.fulfilled, (state, action) => {
        const index = state.notices.findIndex(
          (notice) => notice._id === action.payload._id
        );
        if (index !== -1) {
          state.notices[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateNoticeThunk.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // Delete Notice
      .addCase(deleteNoticeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNoticeThunk.fulfilled, (state, action) => {
        state.notices = state.notices.filter(
          (notice) => notice._id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteNoticeThunk.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

// Export actions
export const {
  setSelectedNotice,
  setEditMode,
  resetEditMode,
  setTitleToDelete,
  resetTitleToDelete,
} = noticeSlice.actions;

// Export reducer
export default noticeSlice.reducer;
