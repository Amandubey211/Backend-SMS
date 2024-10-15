import { createSlice } from "@reduxjs/toolkit"
import { fetchSubjectGrades } from "./grades.action"
const initialState = {
    subjectGrades:[],
    error:null,
    studentGrade:{},
    loading:false,
}
const subjectGrades = createSlice({
    name:"subjectGrades",
    initialState,
    reducers: {
        setStudentGrade(state, action) {
          state.studentGrade = action.payload;
        }},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchSubjectGrades.pending,(state)=>{
            state.loading =true;
            state.error = null;
        })
        .addCase(fetchSubjectGrades.fulfilled,(state,action)=>{
            state.loading =false;
            state.subjectGrades = action.payload;
            state.error = null;
        })
        .addCase(fetchSubjectGrades.rejected,(state,action)=>{
            state.loading =false;
            state.error = action.payload;
        })
    }
});
export const { setStudentGrade } = subjectGrades.actions;
export default subjectGrades.reducer;