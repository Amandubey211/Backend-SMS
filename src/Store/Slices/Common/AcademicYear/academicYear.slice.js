import { createSlice } from "@reduxjs/toolkit";
import { fetchAcademicYear } from "./academicYear.action";

const initialState = {
    activeAcademicYear:{},
    academicYears:[],
    loading:false,
    error:null
}

const academicYearSlice = createSlice({

    name: "academicYear",
    initialState,
    reducers: {
        setActiveAcademicYear: (state, action) => {
            state.activeAcademicYear = action.payload;
        },
  
    },

    extraReducers: (builder) => {
        builder.
            addCase(fetchAcademicYear.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchAcademicYear.fulfilled, (state, action) => {
                state.loading = false;
                state.academicYears = action.payload;
                state.error = null;
            
            })
            .addCase(fetchAcademicYear.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload  || true;
            })
    }
})

export const { setActiveAcademicYear } = academicYearSlice.actions;
export default academicYearSlice.reducer