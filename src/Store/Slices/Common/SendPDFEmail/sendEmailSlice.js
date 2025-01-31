import { createSlice } from "@reduxjs/toolkit";
import { sendEmail } from "./sendEmailThunk";

const initialState = {
    loading: false,
    successMessage: null,
    error: null,
};

const sendEmailSlice = createSlice({
    name: "sendEmail",
    initialState,
    reducers: {
        clearEmailState: (state) => {
            state.loading = false;
            state.successMessage = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload;
            })
            .addCase(sendEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearEmailState } = sendEmailSlice.actions;
export default sendEmailSlice.reducer;
