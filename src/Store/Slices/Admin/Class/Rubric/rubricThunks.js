import axios from "axios";
import {
  setRubrics,
  setAssignments,
  setQuizzes,
  setLoading,
  setError,
  setRubricToEdit,
  setCriteria,
  setExistingRubricId,
  setRubricName,
  setRubricLoading,
} from "./rubricSlice";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";
import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";

const say = localStorage.getItem("say");

// Helper function to get the token from Redux state with centralized error handling
const getToken = (state, dispatch) => {
  const token = state.common.auth?.token;
  if (!token) {
    dispatch(setShowError(true));
    dispatch(setErrorMsg("Authentication Failed"));
    throw new Error("Authentication Failed");
  }
  return `Bearer ${token}`;
};

// Centralized error handling
const handleError = (error, dispatch) => {
  const err = ErrorMsg(error);
  dispatch(setShowError(true));
  dispatch(setErrorMsg(err.message));
  toast.error(err.message);
  return err.message;
};

// Fetch Rubrics by Subject ID Thunk
export const fetchRubricsBySubjectId = (sid) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const token = getToken(getState(), dispatch);
    const response = await axios.get(`${baseUrl}/admin/rubric/subject/${sid}?say=${say}`, {
      headers: { Authentication: token },
    });

    if (response.data.success) {
      dispatch(setRubrics(response.data.rubrics));
    } else {
      throw new Error(response.data.message || "Failed to fetch rubrics.");
    }
  } catch (err) {
    dispatch(setError(handleError(err, dispatch)));
  } finally {
    dispatch(setLoading(false));
  }
};

// Delete Rubric Thunk
export const deleteRubricThunk = (rubricId) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const token = getToken(getState(), dispatch);
    await axios.delete(`${baseUrl}/admin/rubric/${rubricId}?say=${say}`, {
      headers: { Authentication: token },
    });

    toast.success("Rubric deleted successfully");
    return { success: true };
  } catch (err) {
    const errorMessage = handleError(err, dispatch);
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setLoading(false));
  }
};

// Update Rubric Thunk
export const updateRubricThunk = (rubricId, rubricData) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const token = getToken(getState(), dispatch);
    const response = await axios.put(
      `${baseUrl}/admin/rubric/${rubricId}?say=${say}`,
      rubricData,
      {
        headers: { Authentication: token },
      }
    );

    if (response.data.success) {
      toast.success("Rubric updated successfully");
      return { success: true };
    } else {
      throw new Error(response.data.message || "Failed to update rubric");
    }
  } catch (err) {
    const errorMessage = handleError(err, dispatch);
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setLoading(false));
  }
};

// Create Assignment Rubric Thunk
export const createAssignmentRubricThunk = (rubricData) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const token = getToken(getState(), dispatch);
    const response = await axios.post(
      `${baseUrl}/admin/create_rubric?say=${say}`,
      rubricData,
      {
        headers: { Authentication: token },
      }
    );

    if (response.data.success) {
      toast.success("Rubric created successfully");
      return { success: true, data: response.data };
    } else {
      throw new Error(response.data.message || "Failed to create rubric");
    }
  } catch (err) {
    const errorMessage = handleError(err, dispatch);
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setLoading(false));
  }
};

// Create Quiz Rubric Thunk
export const createQuizRubricThunk = (rubricData) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const token = getToken(getState(), dispatch);
    const response = await axios.post(
      `${baseUrl}/admin/quiz/create_rubric?say=${say}`,
      rubricData,
      {
        headers: { Authentication: token },
      }
    );

    if (response.data.success) {
      toast.success("Rubric created successfully");
      return { success: true, data: response.data };
    } else {
      throw new Error(response.data.message || "Failed to create rubric");
    }
  } catch (err) {
    const errorMessage = handleError(err, dispatch);
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setLoading(false));
  }
};

// Fetch Filtered Assignments Thunk
export const fetchFilteredAssignmentsThunk = (sid) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const token = getToken(getState(), dispatch);
    const response = await axios.get(`${baseUrl}/admin/assignments/${sid}?say=${say}`, {
      headers: { Authentication: token },
    });

    if (response.data.success) {
      dispatch(setAssignments(response.data.assignments));
    } else {
      throw new Error(response.data.message || "Failed to fetch assignments.");
    }
  } catch (err) {
    dispatch(setError(handleError(err, dispatch)));
  } finally {
    dispatch(setLoading(false));
  }
};

// Fetch Filtered Quizzes Thunk
export const fetchFilteredQuizzesThunk = (sid) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const token = getToken(getState(), dispatch);
    const response = await axios.get(`${baseUrl}/admin/quizzes/${sid}?say=${say}`, {
      headers: { Authentication: token },
    });

    if (response.data.success) {
      dispatch(setQuizzes(response.data.quizzes));
    } else {
      throw new Error(response.data.message || "Failed to fetch quizzes.");
    }
  } catch (err) {
    dispatch(setError(handleError(err, dispatch)));
  } finally {
    dispatch(setLoading(false));
  }
};

// Get Rubric by ID Thunk
export const getRubricByIdThunk = (id) => async (dispatch, getState) => {
  dispatch(setRubricLoading(true));
  dispatch(setError(null));

  try {
    const token = getToken(getState(), dispatch);
    const response = await axios.get(`${baseUrl}/admin/rubric/${id}?say=${say}`, {
      headers: { Authentication: token },
    });

    if (response.data.success) {
      dispatch(setRubricToEdit(response.data.rubric));
      dispatch(setCriteria(response.data.rubric.criteria));
      dispatch(setRubricName(response.data.rubric.name));
      dispatch(setExistingRubricId(response.data.rubric._id));
      return { success: true, rubric: response.data.rubric };
    } else {
      throw new Error(response.data.message || "Failed to fetch rubric.");
    }
  } catch (err) {
    const errorMessage = handleError(err, dispatch);
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setRubricLoading(false));
  }
};
