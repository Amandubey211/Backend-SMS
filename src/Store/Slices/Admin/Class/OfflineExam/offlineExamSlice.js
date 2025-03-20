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
  selectedExamStudents: [],
  // isOpen: false,
  // setIsModalOpen,
  totalExams: 0,
  totalPages: 0,
  currentPage: 1,
  perPage: 10,
  startDate: null,
  endDate: null,
};
const offlineExamSlice = createSlice({
  name: "offline-exam",
  initialState,
  reducers: {
    setSelectedExamStudents: (state, action) => {
      //console.log("action selected exam", action.payload);

      state.selectedExamStudents = action.payload;
    },
    setPagination: (state, action) => {
      const { totalExams, totalPages, currentPage, perPage, startDate, endDate } = action.payload;
      state.totalExams = totalExams;
      state.totalPages = totalPages;
      state.currentPage = currentPage;
      state.perPage = perPage;
      state.startDate = startDate || state.startDate;
      state.endDate = endDate || state.endDate;
    },
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
        const { totalExams, totalPages, currentPage, perPage, startDate, endDate } = action?.payload?.pagination || {};
        state.totalExams = totalExams || 0;
        state.totalPages = totalPages || 0;
        state.currentPage = currentPage || 1;
        state.perPage = perPage || 10;
        state.startDate = startDate || state.startDate;
        state.endDate = endDate || state.endDate;
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
export const { setSelectedExamStudents } = offlineExamSlice.actions;
export default offlineExamSlice.reducer;
