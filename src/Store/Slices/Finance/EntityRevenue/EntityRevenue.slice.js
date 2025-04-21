// src/store/finance/EntityRevenue/EntityRevenueSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createEntityRevenue, EntityRevenueGraph, fetchAllEntityRevenue, fetchAllEntityRevenueGraph, fetchEntityRevenueCardData, updateEntityRevenue } from "./EntityRevenue.thunk";


const initialState = {

  allEntityRevenue: [],
  entityRevenueGraph: [],
  totalRecords:0,
  totalPages:1,
  currentPage: 1,
  paidAllAmount:0,
  totalAllAmount:0,
  fee: null,
  loading: false,
  error: null,
  entityRevenueGraph: [],
  entityRevenueCardData:{}
};

const EntityRevenueSlice = createSlice({
  name: "EntityRevenue",
  initialState,
  extraReducers: (builder) => {
    

    builder
      .addCase(fetchAllEntityRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEntityRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.allEntityRevenue = action.payload.data || [];
        state.totalRecords= action.payload.totalRecords;
        state.totalPages= action.payload.totalPages;
        state.currentPage= action.payload.currentPage;
        state.paidAllAmount= action.payload.paidAllAmount;
        state.totalAllAmount = action.payload.totalAllAmount;
       
      })
      .addCase(fetchAllEntityRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
      builder
      .addCase(fetchAllEntityRevenueGraph.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEntityRevenueGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.entityRevenueGraph = action.payload.data || [];
       
      })
      .addCase(fetchAllEntityRevenueGraph.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // Create student fee
    builder
      .addCase(createEntityRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEntityRevenue.fulfilled, (state, action) => {
        state.loading = false;
        //state.fees.push(action.payload.data);
      })
      .addCase(createEntityRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
    
    
    

    

    builder
      .addCase(EntityRevenueGraph.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(EntityRevenueGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.stdFeesGraph = action.payload?.data;
      })
      .addCase(EntityRevenueGraph.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });

    
    builder
      .addCase(fetchEntityRevenueCardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntityRevenueCardData.fulfilled, (state, action) => {
        state.loading = false;
        state.entityRevenueCardData = action.payload;
      })
      .addCase(fetchEntityRevenueCardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});
export default EntityRevenueSlice.reducer;
