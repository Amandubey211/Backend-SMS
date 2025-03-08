import { createSlice } from "@reduxjs/toolkit";
import { stdRubric } from "./rubric.action";

const initialState = {
  loading: false,
  error: false,
  RubricData: [],
  isModalOpen: false,
  readonlyMode: false,
};

const stdRubricSlice = createSlice({
  name: "studentRubric",
  initialState,
  reducers: {
    setRubricField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetRubricState: (state) => {
      state.isModalOpen = false;
      state.readonlyMode = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(stdRubric.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(stdRubric.fulfilled, (state, action) => {
        state.loading = false;
        state.RubricData = action.payload;
      })
      .addCase(stdRubric.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

// Fix: Ensure setRubricField and resetRubricState are exported
export const { setRubricField, resetRubricState } = stdRubricSlice.actions;
export default stdRubricSlice.reducer;