import { createSlice } from "@reduxjs/toolkit";
import { fetchAcademicYear, updateAcademicYear } from "./academicYear.action";

const initialState = {
    seletedAcademicYear:{},
    academicYears:[],
    loading:false,
    error:null
}

const academicYearSlice = createSlice({

    name: "academicYear",
    initialState,
    reducers: {
        setSeletedAcademicYear: (state, action) => {
            state.seletedAcademicYear = action.payload;
        },
  
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchAcademicYear.pending, (state) => {
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

            .addCase(updateAcademicYear.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateAcademicYear.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            
            })
            .addCase(updateAcademicYear.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload  || true;
            })
    }
})

export const { setSeletedAcademicYear } = academicYearSlice.actions;
export default academicYearSlice.reducer