import { createSlice } from "@reduxjs/toolkit";

const CommonSlice = createSlice({
  name: "Common",
  initialState: {
    selectedClass: null,
    selectedSubject: null,
    selectedModule: {
      moduleId: null,
      name: null,
      chapters: [],
    },
    NavbarData: {
      leftHeading: ["Student Diwan"],
    },
    selectedSection: null,
    studentId: null,
    selectedClassName: "",
    selectedSubjectName: "",
  },
  reducers: {
    setLeftHeading: (state, action) => {
      state.NavbarData.leftHeading = action.payload;
    },
    setSelectedClass: (state, action) => {
      state.selectedClass = action.payload;
    },
    setSelectedSubject: (state, action) => {
      state.selectedSubject = action.payload;
    },

    setSelectedModule: (state, action) => {
      state.selectedModule = action.payload;
    },

    setStudentId: (state, action) => {
      state.studentId = action.payload;
    },

    setSelectedClassName: (state, action) => {
      state.selectedClassName = action.payload;
    },
    setSelectedSubjectName: (state, action) => {
      state.selectedSubjectName = action.payload;
    },
    setSelectedSectionId: (state, action) => {
      state.selectedSection = action.payload;
    },
  },
});

export const {
  setLeftHeading,
  setStudentId,
  setSelectedSubject,
  setSelectedSubjectName,
  setSelectedClass,
  setSelectedClassName,
  setSelectedModule,
  setSelectedSectionId
} = CommonSlice.actions;

export default CommonSlice.reducer;
