import { createSlice } from "@reduxjs/toolkit";
import {
  fetchGroupsByClass,
  fetchSectionsByClass,
  fetchUnassignedStudents,
  createGroup,
  updateGroup,
  deleteGroup,
  createSection,
  updateSection,
  deleteSection,
  assignStudentToSection,
  removeStudentFromGroup,
  fetchGroupsByClassAndSection,
  fetchSectionsNamesByClass,
} from "./groupSectionThunks";

const initialState = {
  sectionsList: [], // List of all sections
  groupsList: [], // List of all groups
  unassignedStudentsList: [], // List of unassigned students
  // Separate loading flags:
  groupsLoading: false,
  sectionsLoading: false,
  unassignedLoading: false,
  error: null, // Error state
};

const groupSectionSlice = createSlice({
  name: "group_section",
  initialState,
  reducers: {
    setSectionsList(state, action) {
      state.sectionsList = action.payload;
    },
    setGroupsList(state, action) {
      state.groupsList = action.payload;
    },
    setUnassignedStudentsList(state, action) {
      state.unassignedStudentsList = action.payload;
    },
    clearGroupsList(state) {
      state.groupsList = []; // Clear the groups list when switching classes
    },
    clearSectionsList(state) {
      state.sectionsList = []; // Clear the sections list when switching classes
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sections
      .addCase(fetchSectionsByClass.pending, (state) => {
        state.sectionsLoading = true;
        state.error = null;
      })
      .addCase(fetchSectionsByClass.fulfilled, (state, action) => {
        state.sectionsLoading = false;
        state.sectionsList = action.payload;
      })
      .addCase(fetchSectionsByClass.rejected, (state, action) => {
        state.sectionsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSectionsNamesByClass.pending, (state) => {
        state.sectionsLoading = true;
        state.error = null;
      })
      .addCase(fetchSectionsNamesByClass.fulfilled, (state, action) => {
        state.sectionsLoading = false;
        state.sectionsList = action.payload;
      })
      .addCase(fetchSectionsNamesByClass.rejected, (state, action) => {
        state.sectionsLoading = false;
        state.error = action.payload;
      })

      // Fetch Groups (all or by section)
      .addCase(fetchGroupsByClass.pending, (state) => {
        state.groupsLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupsByClass.fulfilled, (state, action) => {
        state.groupsLoading = false;
        state.groupsList = action.payload;
      })
      .addCase(fetchGroupsByClass.rejected, (state, action) => {
        state.groupsLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchGroupsByClassAndSection.pending, (state) => {
        state.groupsLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupsByClassAndSection.fulfilled, (state, action) => {
        state.groupsLoading = false;
        state.groupsList = action.payload;
      })
      .addCase(fetchGroupsByClassAndSection.rejected, (state, action) => {
        state.groupsLoading = false;
        state.error = action.payload;
      })

      // Fetch Unassigned Students
      .addCase(fetchUnassignedStudents.pending, (state) => {
        state.unassignedLoading = true;
        state.error = null;
      })
      .addCase(fetchUnassignedStudents.fulfilled, (state, action) => {
        state.unassignedLoading = false;
        state.unassignedStudentsList = action.payload;
      })
      .addCase(fetchUnassignedStudents.rejected, (state, action) => {
        state.unassignedLoading = false;
        state.error = action.payload;
      })

      // Create Group
      .addCase(createGroup.pending, (state) => {
        state.groupsLoading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groupsLoading = false;
        // state.groupsList.push(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.groupsLoading = false;
        state.error = action.payload;
      })

      // Update Group
      .addCase(updateGroup.pending, (state) => {
        state.groupsLoading = true;
        state.error = null;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.groupsLoading = false;
        // Optionally update the group in groupsList
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.groupsLoading = false;
        state.error = action.payload;
      })

      // Delete Group
      .addCase(deleteGroup.pending, (state) => {
        state.groupsLoading = true;
        state.error = null;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.groupsLoading = false;
        state.groupsList = state.groupsList.filter(
          (group) => group._id !== action.payload
        );
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.groupsLoading = false;
        state.error = action.payload;
      })

      // Create Section
      .addCase(createSection.pending, (state) => {
        state.sectionsLoading = true;
        state.error = null;
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.sectionsLoading = false;
        state.sectionsList.push(action.payload);
      })
      .addCase(createSection.rejected, (state, action) => {
        state.sectionsLoading = false;
        state.error = action.payload;
      })

      // Update Section
      .addCase(updateSection.pending, (state) => {
        state.sectionsLoading = true;
        state.error = null;
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        state.sectionsLoading = false;
        const index = state.sectionsList.findIndex(
          (section) => section._id === action.payload._id
        );
        if (index !== -1) {
          state.sectionsList[index] = action.payload;
        }
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.sectionsLoading = false;
        state.error = action.payload;
      })

      // Delete Section
      .addCase(deleteSection.pending, (state) => {
        state.sectionsLoading = true;
        state.error = null;
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.sectionsLoading = false;
        state.sectionsList = state.sectionsList.filter(
          (section) => section._id !== action.payload
        );
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.sectionsLoading = false;
        state.error = action.payload;
      })

      // Assign Student to Section
      .addCase(assignStudentToSection.pending, (state) => {
        state.sectionsLoading = true;
        state.error = null;
      })
      .addCase(assignStudentToSection.fulfilled, (state, action) => {
        state.sectionsLoading = false;
      })
      .addCase(assignStudentToSection.rejected, (state, action) => {
        state.sectionsLoading = false;
        state.error = action.payload;
      })

      // Remove Student from Group
      .addCase(removeStudentFromGroup.pending, (state) => {
        state.groupsLoading = true;
        state.error = null;
      })
      .addCase(removeStudentFromGroup.fulfilled, (state, action) => {
        state.groupsLoading = false;
        const groupIndex = state.groupsList.findIndex(
          (group) => group._id === action.payload.groupId
        );
        if (groupIndex !== -1) {
          const studentIndex = state.groupsList[groupIndex].students.findIndex(
            (student) => student._id === action.payload.studentId
          );
          if (studentIndex !== -1) {
            state.groupsList[groupIndex].students.splice(studentIndex, 1);
          }
        }
      })
      .addCase(removeStudentFromGroup.rejected, (state, action) => {
        state.groupsLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSectionsList,
  setGroupsList,
  setUnassignedStudentsList,
  clearGroupsList,
  clearSectionsList,
  clearError,
} = groupSectionSlice.actions;

export default groupSectionSlice.reducer;
