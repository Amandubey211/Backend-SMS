import { createSlice } from "@reduxjs/toolkit";

const CommonSlice = createSlice({
  name: "Common",
  initialState: {
    selectedClass: null,
    selectedSubject: null,
    selectedModule: {
      moduleId: null,
      name: null,
    selectedModule: {
      moduleId: null,
      name: null,
      chapters: [],

    },
    selectedSection: null,  // Add selectedSection
    studentId: null, // Add studentId here


    selectedClassName: "",
    selectedSubjectName: "",

    NavbarData: {
      leftHeading: ["aman"],
    },
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
    setSelectedSection: (state, action) => {  // Add setSelectedSection
      state.selectedSection = action.payload;
    },
    setStudentId: (state, action) => { // Add setStudentId action
      state.studentId = action.payload;
    },

    
    setSelectedClassName: (state, action) => {
      state.selectedClassName = action.payload;
    },
    setSelectedSubjectName: (state, action) => {
      state.selectedSubjectName = action.payload;
    },

  },
});

export const { setLeftHeading, setSelectedSection,setStudentId, setSelectedSubject, setSelectedClass, setSelectedModule } =
  CommonSlice.actions;

export default CommonSlice.reducer;
