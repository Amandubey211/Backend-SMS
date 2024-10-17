import { createSlice } from "@reduxjs/toolkit";
import { stdDoAssignment, stdGetAssignment, stdGetFilteredAssignment } from "./assignment.action";

const initialState = {
    loading: false,
    error: false,
    assignmentData: [],
    assignment: null,
}

const stdAssignmentSlice = createSlice({
    name: 'stdAssignment',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(stdGetAssignment.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(stdGetAssignment.fulfilled, (state, action) => {
                state.loading = false;
                state.assignment = action.payload;
            })
            .addCase(stdGetAssignment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })

            // for doing assignment
            .addCase(stdDoAssignment.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(stdDoAssignment.fulfilled, (state, action) => {
                state.loading = false;
                // state.assignmentData = action.payload;
            })
            .addCase(stdDoAssignment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })

            .addCase(stdGetFilteredAssignment.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(stdGetFilteredAssignment.fulfilled, (state, action) => {
                state.loading = false;
                state.assignmentData = action.payload;
            })
            .addCase(stdGetFilteredAssignment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })
    }
});


export const { } = stdAssignmentSlice.actions;
export default stdAssignmentSlice.reducer;

