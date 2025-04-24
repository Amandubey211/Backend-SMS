import { createSlice } from "@reduxjs/toolkit";
import { addFinancialYear, fetchFinancialYear, updateFinancialYear } from "./financialYear.action";

const initialState = {
    FinancialYears:[],
    activeYear:{},
    loading:false,
    error:null
}

const FinancialYearSlice = createSlice({

    name: "FinancialYear",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchFinancialYear.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchFinancialYear.fulfilled, (state, action) => {
                state.loading = false;
                state.FinancialYears = action.payload;
                state.activeYear = action.payload?.find((i)=>i.isActive == true);
                state.error = null;
            
            })
            .addCase(fetchFinancialYear.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload  || true;
            })
            .addCase(addFinancialYear.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(addFinancialYear.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            
            })
            .addCase(addFinancialYear.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload  || true;
            })
            .addCase(updateFinancialYear.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateFinancialYear.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            
            })
            .addCase(updateFinancialYear.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload  || true;
            })
    }
})

export default FinancialYearSlice.reducer