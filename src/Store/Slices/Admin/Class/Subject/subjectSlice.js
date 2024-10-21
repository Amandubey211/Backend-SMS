import { createSlice } from "@reduxjs/toolkit";
import { createSubject, updateSubject, deleteSubject } from "./subjectThunks";

const initialState = {
  subjects: [], // List of subjects for a class
  loading: false, // Loading state
  error: null, // Error state
};

const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    setSubjects(state, action) {
      state.subjects = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create subject
    builder
      .addCase(createSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.loading = false;
        // state.subjects.push(action.payload);
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update subject
    builder
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.loading = false;
        // const index = state.subjects.findIndex(
        //   (subject) => subject._id === action.payload._id
        // );
        // if (index !== -1) {
        //   state.subjects[index] = action.payload;
        // }
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete subject
    builder
      .addCase(deleteSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = state.subjects.filter(
          (subject) => subject._id !== action.payload
        );
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSubjects } = subjectSlice.actions;
export default subjectSlice.reducer;
