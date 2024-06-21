import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allTeachers: [],
};

const TeachersSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    setTeachers: (state, action) => {
      state.allTeachers = action.payload;
    },
  },
});

export const { setTeachers } = TeachersSlice.actions;

export default TeachersSlice.reducer;
