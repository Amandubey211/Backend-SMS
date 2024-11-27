import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTeachersByClass,
  assignTeacher,
  unassignTeacher,
  fetchAllTeachers,
} from "./teacherThunks";

const initialState = {
  assignedTeachers: [], // Teachers currently assigned (the original list)
  filteredTeachers: [], // Filtered list of teachers based on the section
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
      state.filteredTeachers = action.payload; // Set filtered list to the original list initially
    },
    setTeachers(state, action) {
      state.allTeachers = action.payload;
    },
    setSelectedSection(state, action) {
      state.selectedSection = action.payload; // Set the selected section
    },
    filterTeachersBySection(state) {
      if (state.selectedSection == "Everyone") {
        state.filteredTeachers = state.assignedTeachers; // Reset to the original list when "Everyone" is selected
      } else {
        // Filter teachers by selected section
        state.filteredTeachers = state.assignedTeachers?.filter((teacher) =>
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
        state.assignedTeachers = action.payload; // Update assigned teachers
        state.filteredTeachers = action.payload; // Reset filtered teachers to assigned teachers
      })
      .addCase(fetchTeachersByClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all teachers
      .addCase(fetchAllTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.allTeachers = action.payload; // Update all teachers
      })
      .addCase(fetchAllTeachers.rejected, (state, action) => {
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
        state.filteredTeachers = state.filteredTeachers.filter(
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
