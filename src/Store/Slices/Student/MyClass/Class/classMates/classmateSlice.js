import { createSlice } from "@reduxjs/toolkit";
import { stdClassmate } from "./classmate.action";

const initialState = {
    loading: false,
    error: false,
    classmateData: [],
};

const stdClassmateSlice = createSlice({
    name: "studentClassmate",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(stdClassmate.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(stdClassmate.fulfilled, (state, action) => { 
                state.loading = false;
                state.classmateData = action.payload;
            })
            .addCase(stdClassmate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true; 
            });
    },
});

export const {} = stdClassmateSlice.actions;
export default stdClassmateSlice.reducer;
