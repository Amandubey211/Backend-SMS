import { createSlice } from "@reduxjs/toolkit";
import { stdSyllabus } from "./syllabus.action";


const initialState = {
    loading: false,
    error: false,
    syllabusData: [],
};

const stdSyllabusSlice = createSlice({
    name: "studentSyllabus",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(stdSyllabus.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(stdSyllabus.fulfilled, (state, action) => {
                state.loading = false;
                state.syllabusData = action.payload;
            })
            .addCase(stdSyllabus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })
    }
});

export const { } = stdSyllabusSlice.actions;
export default stdSyllabusSlice.reducer;