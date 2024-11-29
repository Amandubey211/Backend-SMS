// src/store/thunks/rubricThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import {
  getData,
  postData,
  putData,
  deleteData,
} from "../../../../../services/apiEndpoints";
import { getAY } from "../../../../../Utils/academivYear";
import { setRubricField } from "./rubricSlice";

// Fetch Rubrics by Subject ID Thunk
export const fetchRubricsBySubjectId = createAsyncThunk(
  "rubric/fetchRubricsBySubjectId",
  async (sid, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await getData(`/admin/rubric/subject/${sid}`, { say });
      return response.rubrics;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete Rubric Thunk
export const deleteRubricThunk = createAsyncThunk(
  "rubric/deleteRubric",
  async (rubricId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      await deleteData(`/admin/rubric/${rubricId}`, { say });

      toast.success("Rubric deleted successfully");
      return rubricId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update Rubric Thunk
export const updateRubricThunk = createAsyncThunk(
  "rubric/updateRubric",
  async ({ rubricId, rubricData }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await putData(`/admin/rubric/${rubricId}`, rubricData, {
        say,
      });

      toast.success("Rubric updated successfully");
      return response.rubric;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Create Assignment Rubric Thunk
export const createAssignmentRubricThunk = createAsyncThunk(
  "rubric/createAssignmentRubric",
  async (rubricData, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await postData("/admin/create_rubric", rubricData, {
        say,
      });

      toast.success("Assignment Rubric created successfully");
      // dispatch(fetchRubricsBySubjectId({sid}))
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Create Quiz Rubric Thunk
export const createQuizRubricThunk = createAsyncThunk(
  "rubric/createQuizRubric",
  async (rubricData, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await postData("/admin/quiz/create_rubric", rubricData, {
        say,
      });

      toast.success("Quiz Rubric created successfully");
      // dispatch(fetchRubricsBySubjectId({sid}))
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// rubricThunks.js

export const getRubricByIdThunk = createAsyncThunk(
  "rubric/getRubricById",
  async (id, { getState, rejectWithValue }) => {
    const say = getAY();

    try {
      // Fetch the rubric by ID (assignmentId or quizId)
      const response = await getData(`/admin/rubric/${id}`, { say });

      const { success, rubric } = response;

      if (success && rubric && rubric?.length !== 0) {
        // Rubric exists
        const existingRubric = rubric; // Assuming rubric is an object

        return {
          criteria: existingRubric.criteria || [],
          rubricName: existingRubric.name || "",
          existingRubricId: existingRubric._id || null,
          assignmentId: existingRubric.assignmentId?._id || "",
          quizId: existingRubric.quizId || "",
          totalPoints: existingRubric.totalScore || 0,
        };
      } else {
        // No existing rubric found
        const state = getState();
        const { selectedAssignmentId, selectedQuizId } = state.admin.rubrics;
        const { assignments } = state.admin.assignments;
        const { quizzes } = state.admin.quizzes;

        let rubricName = "";
        let totalPoints = 0;

        if (selectedAssignmentId) {
          const selectedAssignment = assignments.find(
            (a) => a._id === selectedAssignmentId
          );
          rubricName = selectedAssignment?.name || "";
          totalPoints = selectedAssignment?.points || 0;
        } else if (selectedQuizId) {
          const selectedQuiz = quizzes.find((q) => q._id === selectedQuizId);
          rubricName = selectedQuiz?.name || "";
          totalPoints = selectedQuiz?.totalPoints || 0;
        }

        return {
          criteria: [],
          rubricName,
          existingRubricId: null,
          assignmentId: selectedAssignmentId || "",
          quizId: selectedQuizId || "",
          totalPoints,
        };
      }
    } catch (error) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);
