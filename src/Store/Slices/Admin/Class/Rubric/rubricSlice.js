// src/redux/slices/rubricSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rubrics: [],
  assignments: [],
  quizzes: [],
  loading: false,
  error: null,
  rubricToEdit: null,
  criteria: [],
  existingRubricId: null,
  rubricName: "",
  rubricLoading: false,
};

const rubricSlice = createSlice({
  name: "rubric",
  initialState,
  reducers: {
    setRubrics: (state, action) => {
      state.rubrics = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAssignments: (state, action) => {
      state.assignments = action.payload;
      state.loading = false;
      state.error = null;
    },
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.loading = false;
      state.error = null;
    },
    setRubricLoading: (state, action) => {
      state.rubricLoading = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.error = null;
    },
    setRubricToEdit: (state, action) => {
      state.rubricToEdit = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCriteria: (state, action) => {
      state.criteria = action.payload;
      state.loading = false;
      state.error = null;
    },
    setExistingRubricId: (state, action) => {
      state.existingRubricId = action.payload;
      state.loading = false;
      state.error = null;
    },
    setRubricName: (state, action) => {
      state.rubricName = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setRubrics,
  setAssignments,
  setQuizzes,
  setLoading,
  setError,
  setRubricToEdit,
  setCriteria,
  setExistingRubricId,
  setRubricName,
  setRubricLoading,
} = rubricSlice.actions;

export default rubricSlice.reducer;
