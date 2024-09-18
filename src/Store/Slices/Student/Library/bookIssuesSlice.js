import { createSlice } from "@reduxjs/toolkit";
import { studentIssueBooks } from "./bookIssues.action";


const initialState = {
    loading: false,
    error: false,
    issueBooks: [],
    filters: {
        classLevel: "",
        category: "",
        status: "All",
    }
}
const stdIssueBooksslice = createSlice({
    name: "studentIssueBooks",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(studentIssueBooks.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(studentIssueBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.issueBooks = action.payload?.booksIssue;
            })
            .addCase(studentIssueBooks.rejected, (state, action) => {
                state.loading = false;
                console.log("gyugyugyug",action.payload)
                state.error = action.payload;
            })
    }
})

export const {setFilters } = stdIssueBooksslice.actions;
export default stdIssueBooksslice.reducer;