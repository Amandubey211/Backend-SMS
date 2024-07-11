import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subjects: [],
  modules: [],
  assignments: [],
};

const SubjectsSlice = createSlice({
  name: "Subject",
  initialState,
  reducers: {
    setSubjects: (state, action) => {
      state.subjects = action.payload;
    },
    setModules: (state, action) => {
      state.modules = action.payload;
    },
    setAssignment: (state, action) => {
      state.assignments = action.payload;
    },
  },
});

export const { setSubjects, setModules, setAssignment } = SubjectsSlice.actions;
export default SubjectsSlice.reducer;
