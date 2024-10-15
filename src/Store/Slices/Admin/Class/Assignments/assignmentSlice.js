import { createSlice } from "@reduxjs/toolkit"
import { fetchAllAssignment } from "./assignment.action";

const initialState = {
    assignments:[],
    loading:false,
    error:null
}

const subjectAssignments = createSlice(
    {
        name:"subjectAssignments",
        initialState,
        extraReducers:(builder)=>{
            builder
            .addCase(fetchAllAssignment.pending,(state)=>{
                state.loading =true;
                state.error = null;
            })
            .addCase(fetchAllAssignment.fulfilled,(state,action)=>{
                state.loading =false;
                state.assignments =action.payload;
                state.error = null;
            })
            .addCase(fetchAllAssignment.rejected,(state,action)=>{
                state.loading =false;
                state.error = action.payload;
            })

        }
    }
)

export default subjectAssignments.reducer