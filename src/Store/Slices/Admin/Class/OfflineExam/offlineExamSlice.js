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
    setCurrentPage:(state, action)=>{
      state.currentPage = action.payload;
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
        state.offlineExamData = state.offlineExamData.map((exam) => ({
          ...exam,
          resultsPublished: exam.resultsPublished || false,
          resultsPublishDate: exam.resultsPublishDate || null,
        }));
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
        const newExam = action.payload;
        newExam.resultsPublished = newExam.resultsPublished || false;
        newExam.resultsPublishDate = newExam.resultsPublishDate || null;
        state.offlineExamData.push(newExam);
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
        const updatedExam = action.payload;
        const index = state.offlineExamData.findIndex((exam) => exam._id === updatedExam._id);
        if (index !== -1) {
          state.offlineExamData[index] = updatedExam;
        }
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
export const { setSelectedExamStudents,setCurrentPage} = offlineExamSlice.actions;
export default offlineExamSlice.reducer;
