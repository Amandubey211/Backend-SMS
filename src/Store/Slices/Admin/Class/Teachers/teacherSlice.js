import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTeachersByClass,
  assignTeacher,
  unassignTeacher,
} from "./teacherThunks";

const initialState = {
  assignedTeachers: [], // Teachers currently assigned
  allTeachers: [], // Full list of all teachers
  selectedSection: "Everyone", // Default section filter
  loading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    setTeacherAssign(state, action) {
      state.assignedTeachers = action.payload;
    },
    setTeachers(state, action) {
      state.allTeachers = action.payload;
    },
    setSelectedSection(state, action) {
      state.selectedSection = action.payload; // Set the selected section
    },
    filterTeachersBySection(state) {
      if (state.selectedSection === "Everyone") {
        state.assignedTeachers = state.allTeachers; // Show all teachers if "Everyone" is selected
      } else {
        state.assignedTeachers = state.allTeachers.filter((teacher) =>
          teacher.sectionId.some(
            (section) => section.sectionName === state.selectedSection
          )
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch teachers by class
      .addCase(fetchTeachersByClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachersByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.allTeachers = action.payload; // Store all teachers
        state.assignedTeachers = action.payload; // Initially show all teachers
      })
      .addCase(fetchTeachersByClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Assign teacher
      .addCase(assignTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTeacher.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Unassign teacher
      .addCase(unassignTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unassignTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedTeachers = state.assignedTeachers.filter(
          (teacher) => teacher._id !== action.payload
        );
      })
      .addCase(unassignTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setTeacherAssign,
  setTeachers,
  setSelectedSection,
  filterTeachersBySection,
} = teacherSlice.actions;

export default teacherSlice.reducer;
