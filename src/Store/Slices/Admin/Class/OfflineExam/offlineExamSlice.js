import { createSlice } from "@reduxjs/toolkit";
import {
  createOfflineExam,
  deleteOfflineExamCard,
  deleteOfflineExamStudentSheet,
  fetchAllOfflineExam,
  UpdateOfflineExamCard,
  UpdateOfflineExamStudentSheet,
  UploadOfflineExamSheet,
} from "./oflineExam.action";

const initialState = {
  error: false,
  loading: false,
  offlineExamData: [],
};
const offlineExamSlice = createSlice({
  name: "offline-exam",
  initialState,
  reducers: {
    // synchronous reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOfflineExam.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchAllOfflineExam.fulfilled, (state, action) => {
        state.loading = false;
        state.offlineExamData = action?.payload;
      })
      .addCase(fetchAllOfflineExam.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });

    builder
      .addCase(createOfflineExam.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(createOfflineExam.fulfilled, (state, action) => {
        state.loading = false;
        // state.offlineExamData = action?.payload;
      })
      .addCase(createOfflineExam.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });

    builder
      .addCase(UploadOfflineExamSheet.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(UploadOfflineExamSheet.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(UploadOfflineExamSheet.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });

    builder
      .addCase(UpdateOfflineExamCard.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(UpdateOfflineExamCard.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(UpdateOfflineExamCard.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });

    builder
      .addCase(UpdateOfflineExamStudentSheet.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(UpdateOfflineExamStudentSheet.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(UpdateOfflineExamStudentSheet.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });

    builder
      .addCase(deleteOfflineExamCard.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteOfflineExamCard.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteOfflineExamCard.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });

    builder
      .addCase(deleteOfflineExamStudentSheet.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteOfflineExamStudentSheet.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteOfflineExamStudentSheet.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});
export const {} = offlineExamSlice.actions;
export default offlineExamSlice.reducer;
