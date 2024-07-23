import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allParents: [],
};

const ParentsSlice = createSlice({
  name: 'Parents',
  initialState,
  reducers: {
    setParents: (state, action) => {
      state.allParents = action.payload;
    },
  },
});

export const { setParents } = ParentsSlice.actions;

export default ParentsSlice.reducer;