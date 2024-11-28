import { createSlice } from "@reduxjs/toolkit";
import { fetchBranch } from "./branch.action";
const initialState = {
    branchs:[],
    loading:false,
    error:null
}

const branchSlice = createSlice({
    name: "academicYear",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchBranch.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchBranch.fulfilled, (state, action) => {
                state.loading = false;
                state.branchs = action.payload;
                state.error = null;
            
            })
            .addCase(fetchBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload  || true;
            })
    }
})

export default branchSlice.reducer