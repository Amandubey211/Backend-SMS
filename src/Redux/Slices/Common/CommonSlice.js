import { createSlice } from "@reduxjs/toolkit";

const CommonSlice = createSlice({
  name: "Common",
  initialState: {
    selectedClass: null,
    selectedSubject: null,
    selectedSection: null,  // Add selectedSection
    studentId: null, // Add studentId here

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
    setSelectedSection: (state, action) => {  // Add setSelectedSection
      state.selectedSection = action.payload;
    },
    setStudentId: (state, action) => { // Add setStudentId action
      state.studentId = action.payload;
    },
  },
});

export const { setLeftHeading, setSelectedSubject, setSelectedClass ,setSelectedSection,setStudentId,} =
  CommonSlice.actions;

export default CommonSlice.reducer;
