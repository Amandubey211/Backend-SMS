import { createSlice } from "@reduxjs/toolkit"
import { fetchAllQuizzes } from "./quiz.action";

const initialState = {
    quizzes:[],
    loading:false,
    error:null
}

const subjectQuizzess = createSlice(
    {
        name:"subjectQuizzess",
        initialState,
        extraReducers:(builder)=>{
            builder
            .addCase(fetchAllQuizzes.pending,(state)=>{
                state.loading =true;
                state.error = null;
            })
            .addCase(fetchAllQuizzes.fulfilled,(state,action)=>{
                state.loading =false;
                state.quizzes =action.payload;
                state.error = null;
            })
            .addCase(fetchAllQuizzes.rejected,(state,action)=>{
                state.loading =false;
                state.error = action.payload;
            })

        }
    }
)

export default subjectQuizzess.reducer