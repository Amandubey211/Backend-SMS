import { createSlice } from "@reduxjs/toolkit";

const ClassSlice = createSlice({
  name: "class",
  initialState: {
    class: {},
    assignedTeacher: [],
    sectionsList: [],
    classList: [],
  },
  reducers: {
    setClass: (state, action) => {
      state.class = action.payload;
    },
    setTeacherAssign: (state, action) => {
      state.assignedTeacher = action.payload;
    },
    setClassList: (state, action) => {
      state.classList = action.payload;
    },
    setSectionsList: (state, action) => {
      state.sectionsList = action.payload;
    },
  },
});

export const { setClass, setTeacherAssign,setClassList,setSectionsList } = ClassSlice.actions;

export default ClassSlice.reducer;
