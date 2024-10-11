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
    },
    setAssignments: (state, action) => {
      state.assignments = action.payload;
    },
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRubricLoading: (state, action) => {
      state.rubricLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setRubricToEdit: (state, action) => {
      state.rubricToEdit = action.payload;
    },
    setCriteria: (state, action) => {
      state.criteria = action.payload;
    },
    setExistingRubricId: (state, action) => {
      state.existingRubricId = action.payload;
    },
    setRubricName: (state, action) => {
      state.rubricName = action.payload;
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
