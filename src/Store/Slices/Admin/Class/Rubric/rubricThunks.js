// src/redux/thunks/rubricThunks.js

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

export const fetchRubricsBySubjectId = (sid) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const { common } = getState();
    const token = common.auth.token;

    const response = await axios.get(`${baseUrl}/admin/rubric/subject/${sid}`, {
      headers: { Authentication: `Bearer ${token}` },
    });

    if (response.data.success) {
      dispatch(setRubrics(response.data.rubrics));
    } else {
      dispatch(setError(response.data.message || "Failed to fetch rubrics."));
    }
  } catch (err) {
    dispatch(
      setError(err.response?.data?.message || "Error in fetching rubrics")
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteRubricThunk = (rubricId) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const { common } = getState();
    const token = common.auth.token;

    await axios.delete(`${baseUrl}/admin/rubric/${rubricId}`, {
      headers: { Authentication: `Bearer ${token}` },
    });

    dispatch(setLoading(false));
    toast.success("Rubric deleted successfully");
    return { success: true };
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Failed to delete rubric";
    toast.error(errorMessage);
    dispatch(setLoading(false));
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const updateRubricThunk =
  (rubricId, rubricData) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const { common } = getState();
      const token = common.auth.token;

      const response = await axios.put(
        `${baseUrl}/admin/rubric/${rubricId}`,
        rubricData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Rubric updated successfully");
        return { success: true };
      } else {
        const errorMessage = response.data.message || "Failed to update rubric";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update rubric";
      toast.error(errorMessage);
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

export const createAssignmentRubricThunk =
  (rubricData) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const { common } = getState();
      const token = common.auth.token;

      const response = await axios.post(
        `${baseUrl}/admin/create_rubric`,
        rubricData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Rubric created successfully");
        return { success: true, data: response.data };
      } else {
        const errorMessage = response.data.message || "Failed to create rubric";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create rubric";
      toast.error(errorMessage);
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

export const createQuizRubricThunk =
  (rubricData) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const { common } = getState();
      const token = common.auth.token;

      const response = await axios.post(
        `${baseUrl}/admin/quiz/create_rubric`,
        rubricData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Rubric created successfully");
        return { success: true, data: response.data };
      } else {
        const errorMessage = response.data.message || "Failed to create rubric";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create rubric";
      toast.error(errorMessage);
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchFilteredAssignmentsThunk =
  (sid) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const { common } = getState();
      const token = common.auth.token;

      const response = await axios.get(`${baseUrl}/admin/assignments/${sid}`, {
        headers: { Authentication: `Bearer ${token}` },
      });

      if (response.data.success) {
        dispatch(setAssignments(response.data.assignments));
      } else {
        dispatch(
          setError(response.data.message || "Failed to fetch assignments.")
        );
      }
    } catch (err) {
      dispatch(
        setError(err.response?.data?.message || "Error in fetching assignments")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchFilteredQuizzesThunk =
  (sid) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const { common } = getState();
      const token = common.auth.token;

      const response = await axios.get(`${baseUrl}/admin/quizzes/${sid}`, {
        headers: { Authentication: `Bearer ${token}` },
      });

      if (response.data.success) {
        dispatch(setQuizzes(response.data.quizzes));
      } else {
        dispatch(setError(response.data.message || "Failed to fetch quizzes."));
      }
    } catch (err) {
      dispatch(
        setError(err.response?.data?.message || "Error in fetching quizzes")
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getRubricByIdThunk = (id) => async (dispatch, getState) => {
  dispatch(setRubricLoading(true));
  dispatch(setError(null));

  try {
    const { common } = getState();
    const token = common.auth.token;

    const response = await axios.get(`${baseUrl}/admin/rubric/${id}`, {
      headers: { Authentication: `Bearer ${token}` },
    });

    if (response.data.success) {
      dispatch(setRubricToEdit(response.data.rubric));
      dispatch(setCriteria(response.data.rubric.criteria));
      dispatch(setRubricName(response.data.rubric.name));
      dispatch(setExistingRubricId(response.data.rubric._id));
      return { success: true, rubric: response.data.rubric };
    } else {
      dispatch(setError(response.data.message || "Failed to fetch rubric."));
      return { success: false };
    }
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Failed to fetch rubric";
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setRubricLoading(false));
  }
};
