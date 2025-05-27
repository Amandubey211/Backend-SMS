import { createSlice } from "@reduxjs/toolkit";
import {getSchoolTimeTable} from './asctimetablethunk'


const initialState = {
  timeTableData: {},
  loading: false,
  error: null,
  isModalOpen: false,
  Modaldata: {},
};

const timeTableSlice = createSlice({
  name: "timeTable",
  initialState,
  reducers: {

    setCellModal: (state, action) => {
      state.isModalOpen = true;
      state.Modaldata = action.payload
    },
    setCellModalCancel: (state, action) => {
      state.isModalOpen = false;
      state.Modaldata = {}
    }
  },

  extraReducers: (builder) => {
    builder
      // Fetch timeTables 
      .addCase(getSchoolTimeTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSchoolTimeTable.fulfilled, (state, action) => {
        state.timeTableData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getSchoolTimeTable.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
   
  },
});
export const {
  setCellModal,
  setCellModalCancel
} = timeTableSlice.actions;

export default timeTableSlice.reducer;
