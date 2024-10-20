import { createSlice } from "@reduxjs/toolkit";
import { fetchAttemptHistory, stdGetQuiz, stdGetSingleQuiz } from "./quizes.action";



const initialState = {
    loading: false,
    error: false,
    // Quizzes List
    quizData: [],

    searchQuery: "",

    // Quiz page
    itemDetails:{},
    activeTab:"instructions",
    selectedOptions:{},

    //quiz questions
    currentQuestionIndex:0,


    // attempt history
    attemptHistory:[],
    selectedAttempt:null,


    //submit quiz
    quizResults:{
        totalPoints: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
    },
}

const stdQuizSlice = createSlice({
    name: 'studentQuiz',
    initialState,
    reducers: {
       
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setActiveTab:(state, action) => {
            state.activeTab = action.payload;
        },
        setSelectedOptions:(state, action) => {
            state.selectedOptions = action.payload;
        },
        setCurrentQuestionIndex:(state, action) => {
            state.selectedOptions = action.payload;
        },
        setSelectedAttempt:(state, action) => {
            state.selectedAttempt = action.payload;
        },
        setQuizResults:(state, action) => {
            state.quizResults = action.payload;
        },
        setAttemptHistory:(state, action) => {
            state.attemptHistory = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(stdGetQuiz.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(stdGetQuiz.fulfilled, (state, action) => {
                state.loading = false;
                state.quizData = action.payload;
            })
            .addCase(stdGetQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })

            .addCase(stdGetSingleQuiz.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(stdGetSingleQuiz.fulfilled, (state, action) => {
                state.loading = false;
                state.itemDetails = action.payload;
            })
            .addCase(stdGetSingleQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })

            .addCase(fetchAttemptHistory.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchAttemptHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.attemptHistory = action.payload;
            })
            .addCase(fetchAttemptHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })
    }
});

export const {  setSearchQuery, setActiveTab, setSelectedOptions, setCurrentQuestionIndex, setSelectedAttempt, setQuizResults, setAttemptHistory } = stdQuizSlice.actions;
export default stdQuizSlice.reducer;



