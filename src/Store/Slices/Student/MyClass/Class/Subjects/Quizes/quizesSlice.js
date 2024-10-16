import { createSlice } from "@reduxjs/toolkit";
import { stdGetQuiz } from "./quizes.action";
import { act } from "react";


const initialState = {
    loading: false,
    error: false,
    quizData: [],
    filters: {
        moduleId: "",
        chapterId: ""
    },
    searchQuery: ""
}

const stdQuizSlice = createSlice({
    name: 'studentQuiz',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        }
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
    }
});

export const { setFilters, setSearchQuery } = stdQuizSlice.actions;
export default stdQuizSlice.reducer;



