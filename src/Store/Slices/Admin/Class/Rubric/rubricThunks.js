// src/redux/thunks/rubricThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";
import {
  getData,
  deleteData,
  putData,
  postData,
} from "../../../../../services/apiEndpoints";
import { handleError } from "../../../Common/Alerts/errorhandling.action";

// Fetch Rubrics by Subject ID Thunk
export const fetchRubricsBySubjectId = createAsyncThunk(
  "rubric/fetchRubricsBySubjectId",
  async (sid, { rejectWithValue }) => {
    try {
      const say = getAY();
      const response = await getData(`/admin/rubric/subject/${sid}?say=${say}`);
      return response.rubrics;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Delete Rubric Thunk
export const deleteRubricThunk = createAsyncThunk(
  "rubric/deleteRubric",
  async (rubricId, { rejectWithValue }) => {
    try {
      const say = getAY();
      await deleteData(`/admin/rubric/${rubricId}?say=${say}`);
      toast.success("Rubric deleted successfully");
      return rubricId;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Update Rubric Thunk
export const updateRubricThunk = createAsyncThunk(
  "rubric/updateRubric",
  async ({ rubricId, rubricData }, { rejectWithValue }) => {
    try {
      const say = getAY();
      const response = await putData(
        `/admin/rubric/${rubricId}?say=${say}`,
        rubricData
      );
      if (response.success) {
        toast.success("Rubric updated successfully");
        return response.rubric; // Assuming the updated rubric is returned
      } else {
        return rejectWithValue("Update failed");
      }
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Create Assignment Rubric Thunk
export const createAssignmentRubricThunk = createAsyncThunk(
  "rubric/createAssignmentRubric",
  async (rubricData, { rejectWithValue }) => {
    try {
      const say = getAY();
      const response = await postData(
        `/admin/create_rubric?say=${say}`,
        rubricData
      );
      if (response.success) {
        toast.success("Rubric created successfully");
        return response.rubric; // Assuming the created rubric is returned
      } else {
        return rejectWithValue("Creation failed");
      }
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Create Quiz Rubric Thunk
export const createQuizRubricThunk = createAsyncThunk(
  "rubric/createQuizRubric",
  async (rubricData, { rejectWithValue }) => {
    try {
      const say = getAY();
      const response = await postData(
        `/admin/quiz/create_rubric?say=${say}`,
        rubricData
      );
      if (response.success) {
        toast.success("Rubric created successfully");
        return response.rubric; // Assuming the created rubric is returned
      } else {
        return rejectWithValue("Creation failed");
      }
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Fetch Filtered Assignments Thunk
export const fetchFilteredAssignmentsThunk = createAsyncThunk(
  "rubric/fetchFilteredAssignments",
  async (sid, { rejectWithValue }) => {
    try {
      const say = getAY();
      const response = await getData(`/admin/assignments/${sid}?say=${say}`);
      if (response.success) {
        return response.assignments;
      } else {
        return [];
      }
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Fetch Filtered Quizzes Thunk
export const fetchFilteredQuizzesThunk = createAsyncThunk(
  "rubric/fetchFilteredQuizzes",
  async (sid, { rejectWithValue }) => {
    try {
      const say = getAY();
      const response = await getData(`/admin/quizzes/${sid}?say=${say}`);
      if (response.success) {
        return response.quizzes;
      } else {
        return [];
      }
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Get Rubric by ID Thunk
export const getRubricByIdThunk = createAsyncThunk(
  "rubric/getRubricById",
  async (id, { rejectWithValue }) => {
    try {
      const say = getAY();
      const response = await getData(`/admin/rubric/${id}?say=${say}`);
      if (response.success) {
        return response.rubric;
      } else {
        return rejectWithValue("Rubric not found");
      }
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// import {
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
// } from "./rubricSlice";
// import toast from "react-hot-toast";
// import {
//   ErrorMsg,
//   handleError,
// } from "../../../Common/Alerts/errorhandling.action";
// import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";
// import {
//   deleteData,
//   getData,
//   postData,
//   putData,
// } from "../../../../../services/apiEndpoints";
// import { getAY } from "../../../../../Utils/academivYear";

// // Fetch Rubrics by Subject ID Thunk
// export const fetchRubricsBySubjectId =
//   (sid) => async (dispatch, rejectWithValue) => {
//     dispatch(setLoading(true));
//     try {
//       dispatch(setShowError(false));
//       const say = getAY();
//       const response = await getData(`/admin/rubric/subject/${sid}?say=${say}`);

//       return dispatch(setRubrics(response.rubrics));
//     } catch (error) {
//       dispatch(setLoading(false));
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   };

// // Delete Rubric Thunk
// export const deleteRubricThunk =
//   (rubricId) => async (dispatch, rejectWithValue) => {
//     dispatch(setLoading(true));

//     try {
//       dispatch(setShowError(false));
//       const say = getAY();
//       await deleteData(`/admin/rubric/${rubricId}?say=${say}`);

//       toast.success("Rubric deleted successfully");
//       dispatch(setLoading(false));
//       return { success: true };
//     } catch (error) {
//       dispatch(setLoading(false));
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   };

// // Update Rubric Thunk
// export const updateRubricThunk =
//   (rubricId, rubricData) => async (dispatch, rejectWithValue) => {
//     try {
//       dispatch(setShowError(false));
//       const say = getAY();
//       const response = await putData(
//         `/admin/rubric/${rubricId}?say=${say}`,
//         rubricData
//       );

//       if (response.success) {
//         toast.success("Rubric updated successfully");
//         return { success: true };
//       }
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   };

// // Create Assignment Rubric Thunk
// export const createAssignmentRubricThunk =
//   (rubricData) => async (dispatch, rejectWithValue) => {
//     try {
//       dispatch(setShowError(false));
//       const say = getAY();
//       const response = await postData(
//         `/admin/create_rubric?say=${say}`,
//         rubricData
//       );

//       if (response.success) {
//         toast.success("Rubric created successfully");
//         return { success: true, data: response };
//       }
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   };

// // Create Quiz Rubric Thunk
// export const createQuizRubricThunk =
//   (rubricData) => async (dispatch, rejectWithValue) => {
//     try {
//       dispatch(setShowError(false));
//       const say = getAY();
//       const response = await postData(
//         `/admin/quiz/create_rubric?say=${say}`,
//         rubricData
//       );

//       if (response.success) {
//         toast.success("Rubric created successfully");
//         return { success: true, data: response };
//       }
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   };

// // Fetch Filtered Assignments Thunk
// export const fetchFilteredAssignmentsThunk =
//   (sid) => async (dispatch, rejectWithValue) => {
//     try {
//       dispatch(setShowError(false));
//       const say = getAY();
//       const response = await getData(`/admin/assignments/${sid}?say=${say}`);

//       if (response.success) {
//         return dispatch(setAssignments(response.assignments));
//       } else {
//         return dispatch(setAssignments([]));
//       }
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   };

// // Fetch Filtered Quizzes Thunk
// export const fetchFilteredQuizzesThunk =
//   (sid) => async (dispatch, rejectWithValue) => {
//     try {
//       dispatch(setShowError(false));
//       const say = getAY();
//       const response = await getData(`/admin/quizzes/${sid}?say=${say}`);

//       if (response.success) {
//         return dispatch(setQuizzes(response.quizzes));
//       } else {
//         return dispatch(setQuizzes([]));
//       }
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   };

// // Get Rubric by ID Thunk
// export const getRubricByIdThunk = (id) => async (dispatch, rejectWithValue) => {
//   try {
//     dispatch(setShowError(false));
//     const say = getAY();
//     const response = await getData(`/admin/rubric/${id}?say=${say}`);

//     if (response.success) {
//       dispatch(setRubricToEdit(response.rubric));
//       dispatch(setCriteria(response.rubric.criteria));
//       dispatch(setRubricName(response.rubric.name));
//       dispatch(setExistingRubricId(response.rubric._id));
//       return { success: true, rubric: response.rubric };
//     }
//   } catch (error) {
//     return handleError(error, dispatch, rejectWithValue);
//   }
// };
