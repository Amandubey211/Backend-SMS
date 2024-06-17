import { createSlice } from "@reduxjs/toolkit";

const AdminSlice = createSlice({
  name: "Admin",
  initialState: {
    unVerifiedStudents: [],
    rejectedStudents: [],
    classList: [],
    studentGrade:{}
  },
  reducers: {
    setUnVerifiedStudents: (state, action) => {
      state.unVerifiedStudents = action.payload;
    },
    setRejectedStudents: (state, action) => {
      state.rejectedStudents = action.payload;
    },
    setClassList: (state, action) => {
      state.classList = action.payload;
    },
    setStudentGrade : (state,action)=>{
      state.studentGrade = action.payload
    }
  },
});

export const {
  setUnVerifiedStudents,
  setClassList,setStudentGrade,

  setRejectedStudents,
} = AdminSlice.actions;

export default AdminSlice.reducer;
