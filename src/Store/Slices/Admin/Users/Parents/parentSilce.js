import { createSlice } from "@reduxjs/toolkit";
import { fetchAllParent } from "./parent.action";
const initialState = {
    allParents:[],
    parent:{},
    error:null,
    loading:false,
}
const allParentSlice = createSlice({
    name: "parents",
    initialState,
    reducers: {
      setAllParents(state, action) {
        state.allParents = action.payload;
      },
      setParent(state, action) {
        state.parent= action.payload;
      },
      clearError(state) {
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        // Fetch All Students
        .addCase(fetchAllParent.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllParent.fulfilled, (state, action) => {
          state.loading = false;
          state.allParents = action.payload;
        })
        .addCase(fetchAllParent.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  export const {  setParent, setAllParents, clearError } = allParentSlice.actions;
  export default allParentSlice.reducer;
  