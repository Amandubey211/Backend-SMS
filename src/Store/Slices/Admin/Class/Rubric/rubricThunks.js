
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
import { ErrorMsg, handleError } from "../../../Common/Alerts/errorhandling.action";
import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";
import { deleteData, getData, postData, putData } from "../../../../../services/apiEndpoints";
import { getAY } from "../../../../../Utils/academivYear";


// Fetch Rubrics by Subject ID Thunk
export const fetchRubricsBySubjectId = (sid) => async (dispatch, rejectWithValue) => {
  dispatch(setLoading(true));
  try {
    dispatch(setShowError(false));
    const say = getAY()
    const response = await getData(
      `/admin/rubric/subject/${sid}?say=${say}`
    );
    
   return   dispatch(setRubrics(response.rubrics));
  } catch (error) {
    dispatch(setLoading(false));
    return handleError(error, dispatch, rejectWithValue);
  } 
};

// Delete Rubric Thunk
export const deleteRubricThunk = (rubricId) => async (dispatch, rejectWithValue) => {
  dispatch(setLoading(true));
 
  try {
    dispatch(setShowError(false));
      const say = getAY()
    await deleteData(`/admin/rubric/${rubricId}?say=${say}`);

    toast.success("Rubric deleted successfully");
    dispatch(setLoading(false));
    return { success: true };
  } catch (error) {
    dispatch(setLoading(false));
    return handleError(error, dispatch, rejectWithValue);
  } 
};

// Update Rubric Thunk
export const updateRubricThunk =
  (rubricId, rubricData) => async (dispatch, rejectWithValue) => {
    try {
      dispatch(setShowError(false));
      const say = getAY()
      const response = await putData(
        `/admin/rubric/${rubricId}?say=${say}`,
        rubricData
      );

      if (response.success) {
        toast.success("Rubric updated successfully");
        return { success: true };
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    } 
  };

// Create Assignment Rubric Thunk
export const createAssignmentRubricThunk =
  (rubricData) => async (dispatch, rejectWithValue) => {
  

    try {
      dispatch(setShowError(false));
      const say = getAY()
      const response = await postData(
        `/admin/create_rubric?say=${say}`,
        rubricData
      );

      if (response.success) {
        toast.success("Rubric created successfully");
        return { success: true, data: response };
      } 
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  };

// Create Quiz Rubric Thunk
export const createQuizRubricThunk =
  (rubricData) => async (dispatch, rejectWithValue) => {
    try {
      dispatch(setShowError(false));
      const say = getAY()
      const response = await postData(
        `/admin/quiz/create_rubric?say=${say}`,
        rubricData
      );

      if (response.success) {
        toast.success("Rubric created successfully");
        return { success: true, data: response};
      } 
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  };

// Fetch Filtered Assignments Thunk
export const fetchFilteredAssignmentsThunk =
  (sid) => async (dispatch, rejectWithValue) => {
    

    try {
      dispatch(setShowError(false));
      const say = getAY()
      const response = await getData(
        `/admin/assignments/${sid}?say=${say}`
      );

      if (response.success) {
        return dispatch(setAssignments(response.assignments));
      } else {
        return dispatch(setAssignments([]));
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  };

// Fetch Filtered Quizzes Thunk
export const fetchFilteredQuizzesThunk =
  (sid) => async (dispatch, rejectWithValue) => {
    
    try {
      dispatch(setShowError(false));
      const say = getAY()
      const response = await getData(
        `/admin/quizzes/${sid}?say=${say}`,
        
      );

      if (response.success) {
        return dispatch(setQuizzes(response.quizzes));
      } else {
        return dispatch(setQuizzes([]));
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    } 
  };

// Get Rubric by ID Thunk
export const getRubricByIdThunk = (id) => async (dispatch, rejectWithValue) => {
 
  try {
    dispatch(setShowError(false));
    const say = getAY()
    const response = await getData(
      `/admin/rubric/${id}?say=${say}`
    );

    if (response.success) {
      dispatch(setRubricToEdit(response.rubric));
      dispatch(setCriteria(response.rubric.criteria));
      dispatch(setRubricName(response.rubric.name));
      dispatch(setExistingRubricId(response.rubric._id));
      return { success: true, rubric: response.rubric };
    } 
  } catch (error) {
    return handleError(error, dispatch, rejectWithValue);
  } 
};
