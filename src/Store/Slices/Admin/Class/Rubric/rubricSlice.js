// src/store/slices/rubricSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRubricsBySubjectId,
  deleteRubricThunk,
  updateRubricThunk,
  createAssignmentRubricThunk,
  createQuizRubricThunk,
  getRubricByIdThunk,
} from "./rubricThunks";

const initialState = {
  rubrics: [],
  loading: false,
  error: null,
  rubricToEdit: null,
  criteria: [],
  existingRubricId: null,
  rubricName: "",
  rubricLoading: false,
  isModalOpen: false,
  isSidebarOpen: false,
  editMode: false,
  criteriaToEdit: null,
  selectedAssignmentId: "",
  selectedQuizId: "",
  totalPoints: 0,
  ratings: [],
};

const rubricSlice = createSlice({
  name: "rubric",
  initialState,
  reducers: {
    setRubricField: (state, action) => {
      state[action.payload.field] = action.payload.value;
    },
    resetRubricState: (state) => {
      state.criteria = [];
      state.editMode = false;
      state.criteriaToEdit = null;
      state.rubricToEdit = null;
      state.selectedAssignmentId = "";
      state.selectedQuizId = "";
      state.existingRubricId = null;
      state.rubricName = "";
      state.totalPoints = 0;
      state.ratings = [];
    },
  },
  extraReducers: (builder) => {
    // Handle fetchRubricsBySubjectId
    builder
      .addCase(fetchRubricsBySubjectId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRubricsBySubjectId.fulfilled, (state, action) => {
        state.loading = false;
        state.rubrics = action.payload;
      })
      .addCase(fetchRubricsBySubjectId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle deleteRubricThunk
    builder
      .addCase(deleteRubricThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRubricThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.rubrics = state.rubrics.filter(
          (rubric) => rubric._id !== action.payload
        );
      })
      .addCase(deleteRubricThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle updateRubricThunk
    builder
      .addCase(updateRubricThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRubricThunk.fulfilled, (state, action) => {
        state.loading = false;
        // const index = state.rubrics.findIndex(
        //   (rubric) => rubric._id === action.payload._id
        // );
        // if (index !== -1) {
        //   state.rubrics[index] = action.payload;
        // }
      })
      .addCase(updateRubricThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle createAssignmentRubricThunk
    builder
      .addCase(createAssignmentRubricThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignmentRubricThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createAssignmentRubricThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle createQuizRubricThunk
    builder
      .addCase(createQuizRubricThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuizRubricThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createQuizRubricThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle getRubricByIdThunk
    builder
      .addCase(getRubricByIdThunk.pending, (state) => {
        state.rubricLoading = true;
        state.error = null;
      })
      .addCase(getRubricByIdThunk.fulfilled, (state, action) => {
        state.rubricLoading = false;
        state.criteria = action.payload.criteria || [];
        state.rubricName = action.payload.rubricName || "";
        state.existingRubricId = action.payload.existingRubricId || null;
        state.selectedAssignmentId = action.payload.assignmentId || "";
        state.selectedQuizId = action.payload.quizId || "";
        state.totalPoints = action.payload.totalPoints || 0;
      })
      .addCase(getRubricByIdThunk.rejected, (state, action) => {
        state.rubricLoading = false;
        state.error = action.payload || "Failed to load rubric";
      });

    // General pending and rejected matchers
    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.error = null;
          // state.loading = true; // Commented out because we handle loading per thunk
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload || "An error occurred";
          // state.loading = false; // Commented out because we handle loading per thunk
        }
      );
  },
});

export const { setRubricField, resetRubricState } = rubricSlice.actions;

export default rubricSlice.reducer;
