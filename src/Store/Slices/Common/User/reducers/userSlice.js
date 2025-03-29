import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserData,
  fetchClassData,
  fetchSubjectData,
  updateStudentInfoThunk,
  updateParentInfoThunk, // Imported parent's update thunk
} from "../actions/userActions";

const initialState = {
  userDetails: {}, // Storing user details directly, including studentId if applicable
  step: 1,
  classInfo: {
    selectedClassId: null,
    selectedSemester: {
      id: null,
      name: "",
    },
    selectedClassName: "",
    selectedSection: null,
    selectedSectionName: "",
    selectedModule: {
      moduleId: null,
      name: null,
      chapters: [],
    },
  },
  sidebar: { isOpen: true },
  subjectInfo: {
    selectedSubjectId: null,
    selectedSubjectName: "",
    selectedAssignmentName: null,
  },
  navbar: {
    leftHeading: ["Student Diwan"],
  },
  status: {
    loading: false,
    error: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLeftHeading: (state, action) => {
      state.navbar.leftHeading = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    closeSidebar: (state) => {
      state.sidebar.isOpen = false;
    },
    setSelectedClassId: (state, action) => {
      state.classInfo.selectedClassId = action.payload;
    },
    setSelectedClassName: (state, action) => {
      state.classInfo.selectedClassName = action.payload;
    },
    // Combined action for semester selection
    setSelectedSemester: (state, action) => {
      state.classInfo.selectedSemester = action.payload;
    },
    setSelectedSectionId: (state, action) => {
      state.classInfo.selectedSection = action.payload;
    },
    setSelectedSectionName: (state, action) => {
      state.classInfo.selectedSectionName = action.payload;
    },
    setSelectedModule: (state, action) => {
      state.classInfo.selectedModule = action.payload;
    },
    setSelectedSubjectId: (state, action) => {
      state.subjectInfo.selectedSubjectId = action.payload;
    },
    setSelectedSubjectName: (state, action) => {
      state.subjectInfo.selectedSubjectName = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setSelectedAssignmentName: (state, action) => {
      state.subjectInfo.selectedAssignmentName = action.payload;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setStudentId: (state, action) => {
      state.userDetails.studentId = action.payload;
    },
    resetUserState: (state) => {
      state.userDetails = {};
      state.classInfo = {
        selectedClassId: null,
        selectedSemester: { id: null, name: "" },
        selectedClassName: "",
        selectedSection: null,
        selectedSectionName: "",
        selectedModule: {
          moduleId: null,
          name: null,
          chapters: [],
        },
      };
      state.subjectInfo = {
        selectedSubjectId: null,
        selectedSubjectName: "",
        selectedAssignmentName: null,
      };
      state.navbar.leftHeading = ["Student Diwan"];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserData cases
      .addCase(fetchUserData.pending, (state) => {
        state.status.loading = true;
        state.status.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status.loading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status.loading = false;
        state.status.error = action.payload;
      })
      // fetchClassData cases
      .addCase(fetchClassData.pending, (state) => {
        state.status.loading = true;
        state.status.error = null;
      })
      .addCase(fetchClassData.fulfilled, (state, action) => {
        state.status.loading = false;
        state.classInfo.selectedClass = action.payload.selectedClass;
        state.classInfo.selectedSection = action.payload.selectedSection;
      })
      .addCase(fetchClassData.rejected, (state, action) => {
        state.status.loading = false;
        state.status.error = action.payload;
      })
      // fetchSubjectData cases
      .addCase(fetchSubjectData.pending, (state) => {
        state.status.loading = true;
        state.status.error = null;
      })
      .addCase(fetchSubjectData.fulfilled, (state, action) => {
        state.status.loading = false;
        state.subjectInfo.selectedSubject = action.payload.selectedSubject;
        state.subjectInfo.selectedAssignmentName =
          action.payload.selectedAssignmentName;
      })
      .addCase(fetchSubjectData.rejected, (state, action) => {
        state.status.loading = false;
        state.status.error = action.payload;
      })
      // updateStudentInfoThunk cases
      .addCase(updateStudentInfoThunk.pending, (state) => {
        state.status.loading = true;
        state.status.error = null;
      })
      .addCase(updateStudentInfoThunk.fulfilled, (state, action) => {
        state.status.loading = false;
        // Optionally update state.userDetails here if needed.
      })
      .addCase(updateStudentInfoThunk.rejected, (state, action) => {
        state.status.loading = false;
        state.status.error = action.payload;
      })
      // updateParentInfoThunk cases
      .addCase(updateParentInfoThunk.pending, (state) => {
        state.status.loading = true;
        state.status.error = null;
      })
      .addCase(updateParentInfoThunk.fulfilled, (state, action) => {
        state.status.loading = false;
        // Optionally update state.userDetails here if parent's info is updated.
      })
      .addCase(updateParentInfoThunk.rejected, (state, action) => {
        state.status.loading = false;
        state.status.error = action.payload;
      });
  },
});

export const {
  setLeftHeading,
  toggleSidebar,
  closeSidebar,
  setSelectedClassId,
  setSelectedClassName,
  setSelectedSemester,
  setSelectedSectionId,
  setSelectedSectionName,
  setSelectedModule,
  setSelectedSubjectId,
  setSelectedSubjectName,
  setSelectedAssignmentName,
  setUserDetails,
  setStudentId,
  resetUserState,
  setStep,
} = userSlice.actions;

export default userSlice.reducer;
