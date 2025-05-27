import { createSlice } from "@reduxjs/toolkit";
import {getSchoolTimeTable,getClassTimeTable} from './asctimetablethunk'


const initialState = {
  ascTimeTableData: [],
  ascClassTimeTableData:{},
  loading: false,
  error: null,
  isModalOpen: false,
  Modaldata: {},
};

const ascTimeTableSlice = createSlice({
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
      // Fetch school  timeTables 
      .addCase(getSchoolTimeTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSchoolTimeTable.fulfilled, (state, action) => {
        state.ascTimeTableData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getSchoolTimeTable.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })


    builder
      // Fetch timeTables 
      .addCase(getClassTimeTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClassTimeTable.fulfilled, (state, action) => {
        state.ascClassTimeTableData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getClassTimeTable.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
   
  },
});
export const {
  setCellModal,
  setCellModalCancel
} = ascTimeTableSlice.actions;

export default ascTimeTableSlice.reducer;
