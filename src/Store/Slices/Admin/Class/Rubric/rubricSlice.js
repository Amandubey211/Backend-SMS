import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRubricsBySubjectId,
  deleteRubricThunk,
  updateRubricThunk,
  createAssignmentRubricThunk,
  createQuizRubricThunk,
  fetchFilteredAssignmentsThunk,
  fetchFilteredQuizzesThunk,
  getRubricByIdThunk,
} from "./rubricThunks";

const initialState = {
  rubrics: [],
  assignments: [],
  quizzes: [],
  loading: false,
  error: null,
  rubricToEdit: null,
  criteria: [],
  existingRubricId: null,
  rubricName: "",
  rubricLoading: false,
};

const rubricSlice = createSlice({
  name: "rubric",
  initialState,
  reducers: {
    // Define synchronous reducers if needed
  },
  extraReducers: (builder) => {
    // Fetch Rubrics by Subject ID
    builder
      .addCase(fetchRubricsBySubjectId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRubricsBySubjectId.fulfilled, (state, action) => {
        state.loading = false;
        state.rubrics = action.payload;
      })
      .addCase(fetchRubricsBySubjectId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch rubrics";
      });

    // Delete Rubric
    builder
      .addCase(deleteRubricThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRubricThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.rubrics = state.rubrics.filter(
          (rubric) => rubric._id !== action.payload
        );
      })
      .addCase(deleteRubricThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete rubric";
      });

    // Update Rubric
    builder
      .addCase(updateRubricThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRubricThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.rubrics.findIndex(
          (rubric) => rubric._id === action.payload._id
        );
        if (index !== -1) {
          state.rubrics[index] = action.payload;
        }
      })
      .addCase(updateRubricThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update rubric";
      });

    // Create Assignment Rubric
    builder
      .addCase(createAssignmentRubricThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignmentRubricThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.rubrics.push(action.payload);
      })
      .addCase(createAssignmentRubricThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create assignment rubric";
      });

    // Create Quiz Rubric
    builder
      .addCase(createQuizRubricThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuizRubricThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.rubrics.push(action.payload);
      })
      .addCase(createQuizRubricThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create quiz rubric";
      });

    // Fetch Filtered Assignments
    builder
      .addCase(fetchFilteredAssignmentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredAssignmentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchFilteredAssignmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch assignments";
      });

    // Fetch Filtered Quizzes
    builder
      .addCase(fetchFilteredQuizzesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredQuizzesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchFilteredQuizzesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch quizzes";
      });

    // Get Rubric by ID
    builder
      .addCase(getRubricByIdThunk.pending, (state) => {
        state.rubricLoading = true;
        state.error = null;
      })
      .addCase(getRubricByIdThunk.fulfilled, (state, action) => {
        state.rubricLoading = false;
        state.rubricToEdit = action.payload;
        state.criteria = action.payload.criteria;
        state.rubricName = action.payload.name;
        state.existingRubricId = action.payload._id;
      })
      .addCase(getRubricByIdThunk.rejected, (state, action) => {
        state.rubricLoading = false;
        state.error = action.payload || "Failed to get rubric by ID";
      });
  },
});

export default rubricSlice.reducer;

// // src/redux/slices/rubricSlice.js

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   rubrics: [],
//   assignments: [],
//   quizzes: [],
//   loading: false,
//   error: null,
//   rubricToEdit: null,
//   criteria: [],
//   existingRubricId: null,
//   rubricName: "",
//   rubricLoading: false,
// };

// const rubricSlice = createSlice({
//   name: "rubric",
//   initialState,
//   reducers: {
//     setRubrics: (state, action) => {
//       state.rubrics = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setAssignments: (state, action) => {
//       state.assignments = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setQuizzes: (state, action) => {
//       state.quizzes = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setLoading: (state, action) => {
//       state.loading = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setRubricLoading: (state, action) => {
//       state.rubricLoading = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setRubricToEdit: (state, action) => {
//       state.rubricToEdit = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setCriteria: (state, action) => {
//       state.criteria = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setExistingRubricId: (state, action) => {
//       state.existingRubricId = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setRubricName: (state, action) => {
//       state.rubricName = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//   },
// });

// export const {
//   setRubrics,
//   setAssignments,
//   setQuizzes,
//   setLoading,
//   setError,
//   setRubricToEdit,
//   setCriteria,
//   setExistingRubricId,
//   setRubricName,
//   setRubricLoading,
// } = rubricSlice.actions;

// export default rubricSlice.reducer;
