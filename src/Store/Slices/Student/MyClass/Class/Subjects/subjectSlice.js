import { createSlice } from "@reduxjs/toolkit";
import { stdSubjectProgressPercentage } from "./subject.action";

const initialState = {
  loading: false,
  error: false,
  subject: {
    subjectId: null,
    subjectName: null,
  },
  subjectProgress: [],
};

export const stdSubjectSlice = createSlice({
  name: "studentSubject",
  initialState,
  reducers: {
    setSubject: (state, action) => {
      state.subject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(stdSubjectProgressPercentage.pending, (state, action) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(stdSubjectProgressPercentage.fulfilled, (state, action) => {
        state.loading = false;
        state.subjectProgress = action.payload;
      })
      .addCase(stdSubjectProgressPercentage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export const { setSubject } = stdSubjectSlice.actions;
export default stdSubjectSlice.reducer;
