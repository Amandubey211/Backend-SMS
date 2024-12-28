import { createSlice } from "@reduxjs/toolkit";
import { cancleReturnInvoiceData, fetchReturnCardData, fetchReturnInvoice } from "./adjustment.thunk";

const initialState = {
  adjustmentData: [],
  currentPage:0,
  totalPages:0,
  totalRecords:0,
  pageSize: 5,
  loading: false,
  error: false,
  returnCardData:{},

};

const penaltyAdjustmentSlice = createSlice({
  name: "penaltyandAdjistment",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchReturnInvoice.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchReturnInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.adjustmentData = action.payload?.adjustments;
        state.currentPage=action.payload?.currentPage;
        state.totalPages=action.payload?.totalPages;
        state.totalRecords=action.payload?.totalAdjustments;
      })
      .addCase(fetchReturnInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      .addCase(fetchReturnCardData.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchReturnCardData.fulfilled, (state, action) => {
        state.loading = false;
        state.returnCardData = action.payload;
    
      })
      .addCase(fetchReturnCardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      .addCase(cancleReturnInvoiceData.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(cancleReturnInvoiceData.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(cancleReturnInvoiceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export const { setCurrentPage } = penaltyAdjustmentSlice.actions;
export default penaltyAdjustmentSlice.reducer;
