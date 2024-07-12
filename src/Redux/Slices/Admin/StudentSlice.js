import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allStudent: [],
};

const StudentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.allStudent = action.payload;
    },
  },
});

export const { setStudents } = StudentsSlice.actions;

export default StudentsSlice.reducer;