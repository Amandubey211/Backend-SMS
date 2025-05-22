import { createSlice } from "@reduxjs/toolkit";

import { addScoreCard,getScoreCard, updateScoreCard,addCommonDataToScoreCard, reomoveCommonDataFromScoreCard,addScoreCardCellData } from "./scoreCard.thunk";


const initialState = {
  scoreCardData:{},
  loading: false,
  error: null,
  isModalOpen:false,
  Modaldata:{},
};

const scoreCardSlice = createSlice({
  name: "scoreCard",
  initialState,
    reducers: {

    setCellModal: (state, action) => {
      state.isModalOpen = true;
      state.Modaldata = action.payload
    },
 setCellModalCancel: (state, action) => {
      state.isModalOpen = false;
      state.Modaldata = {}
    }},
  
  extraReducers: (builder) => {
    builder
      // add scoreCards
      .addCase(addScoreCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addScoreCard.fulfilled, (state, action) => {
        state.scoreCardData = action.payload?.data;
        state.loading = false;
      })
      .addCase(addScoreCard.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

  // Fetch scoreCards 
      .addCase(getScoreCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getScoreCard.fulfilled, (state, action) => {
        state.scoreCardData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getScoreCard.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
  // update scoreCards 
      .addCase(updateScoreCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateScoreCard.fulfilled, (state, action) => {
        state.scoreCardData = action.payload?.data;
        state.loading = false;
      })
      .addCase(updateScoreCard.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
  // Add commonData to  scoreCards 
      .addCase(addCommonDataToScoreCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCommonDataToScoreCard.fulfilled, (state, action) => {
        state.scoreCardData = action.payload?.data;
        state.loading = false;
      })
      .addCase(addCommonDataToScoreCard.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
  // remove commonData from  scoreCards 
      .addCase(reomoveCommonDataFromScoreCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reomoveCommonDataFromScoreCard.fulfilled, (state, action) => {
        state.scoreCardData = action.payload?.data;
        state.loading = false;
      })
      .addCase(reomoveCommonDataFromScoreCard.rejected, (state, action) => {

    builder
      // Fetch scoreCards
      .addCase(addScoreCardCellData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addScoreCardCellData.fulfilled, (state, action) => {
        
        state.loading = false;
      })
      .addCase(addScoreCardCellData.rejected, (state, action) => {

        state.error = action.error.message;
        state.loading = false;
      })
  },
});
export const {
  setCellModal,
  setCellModalCancel
} = scoreCardSlice.actions;

export default scoreCardSlice.reducer;
