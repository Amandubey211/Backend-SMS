import { createSlice } from "@reduxjs/toolkit";
import { addScoreCard, addScoreCardCellData } from "./scoreCard.thunk";


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
      // Fetch scoreCards
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
