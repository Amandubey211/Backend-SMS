// childrenSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchChildren,
  fetchAttendance,
  fetchTeachers,
  fetchGrades,
  fetchModules,
  fetchSubjects,
} from "./children.action";

const initialState = {
  children: [],
  subjects: [],
  modules: [],
  grades: {},
  attendance: [],
  loading: false,
  error: null,

  // NEW: store which child is currently selected
  selectedChild: null,
};

const childrenSlice = createSlice({
  name: "children",
  initialState,
  reducers: {
    // Action to set the selected child in redux
    setSelectedChild: (state, action) => {
      state.selectedChild = action.payload; // e.g. the entire child object
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching children
      .addCase(fetchChildren.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.loading = false;
        state.children = action.payload;
      })
      .addCase(fetchChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetching attendance
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetching teachers
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetching grades
      .addCase(fetchGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGrades.fulfilled, (state, action) => {
        state.loading = false;
        const { subjectId } = action.meta.arg;
        state.grades[subjectId] = action.payload;
      })
      .addCase(fetchGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetching modules
      .addCase(fetchModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.loading = false;
        state.modules = action.payload;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetching subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedChild } = childrenSlice.actions;
export default childrenSlice.reducer;
