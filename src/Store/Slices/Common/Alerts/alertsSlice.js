import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showError: false,
}

const alertsSlice = createSlice({
    name: "alerts",
    initialState,
    reducers: {
        setShowError: (state, action) => {
           state.showError=action.payload;
        }
    }
});

export const { setShowError } = alertsSlice.actions;
export default alertsSlice.reducer; 