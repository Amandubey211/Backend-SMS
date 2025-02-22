import { createSlice } from "@reduxjs/toolkit";
import {
  createOfflineExam,
  deleteOfflineExamCard,
  deleteOfflineExamStudent,
  fetchAllOfflineExam,
  UpdateOfflineExamCard,
  UpdateOfflineExamStudent,
  UploadOfflineExamSheet,
} from "./oflineExam.action";

const initialState = {
  error: false,
  loading: false,
  offlineExamData: [],
  // isOpen: false,
  // setIsModalOpen,
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
        state.offlineExamData = action?.payload?.data;
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
      .addCase(UpdateOfflineExamStudent.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(UpdateOfflineExamStudent.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(UpdateOfflineExamStudent.rejected, (state) => {
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
      .addCase(deleteOfflineExamStudent.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteOfflineExamStudent.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteOfflineExamStudent.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});
export const {} = offlineExamSlice.actions;
export default offlineExamSlice.reducer;
