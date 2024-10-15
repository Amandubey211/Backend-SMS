import { createSlice } from "@reduxjs/toolkit";
import { fetchPageView, stdPages } from "./pages.action";


const initialState = {
    loading: false,
    error: false,
    pagesData: [],
    pageView:{},
};

const stdPagesSlice = createSlice({
    name: "studentPages",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(stdPages.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(stdPages.fulfilled, (state, action) => {
                state.loading = false;
                state.pagesData = action.payload;
            })
            .addCase(stdPages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })
            .addCase(fetchPageView.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchPageView.fulfilled, (state, action) => {
                state.loading = false;
                state.pageView = action.payload;
            })
            .addCase(fetchPageView.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })
    }
});

export const { } = stdPagesSlice.actions;
export default stdPagesSlice.reducer;