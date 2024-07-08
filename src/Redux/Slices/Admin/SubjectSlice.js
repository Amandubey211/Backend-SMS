import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subjects: [],
};

const SubjectsSlice = createSlice({
  name: "Subject",
  initialState,
  reducers: {
    setSubjects: (state, action) => {
      state.subjects = action.payload;
    },
  },
});

export const { setSubjects } = SubjectsSlice.actions;
export default SubjectsSlice.reducer;