import { createSlice } from "@reduxjs/toolkit";
import { stdClass } from "./class.action";


const initialState = {
    loading: false,
    error: false,
    classData:{

    },

}
const classSlice = createSlice({
    name: "studentClass",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(stdClass.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(stdClass.fulfilled, (state, action) => {
                state.loading = false;
                state.classData=action.payload;
            })
            .addCase(stdClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});

export const { } = classSlice.actions;
export default classSlice.reducer;
