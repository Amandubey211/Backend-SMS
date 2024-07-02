import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subjects: [],
  modules:[]
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
  },
});

export const { setSubjects ,setModules} = SubjectsSlice.actions;
export default SubjectsSlice.reducer;