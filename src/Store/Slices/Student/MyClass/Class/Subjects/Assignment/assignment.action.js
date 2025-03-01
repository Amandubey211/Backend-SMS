import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../../../Utils/academivYear";
import {
  getData,
  postData,
  putData,
} from "../../../../../../../services/apiEndpoints";

// Fetch assignment details
export const stdGetAssignment = createAsyncThunk(
  "assignment/stdGetAssignment",
  async (aid, { rejectWithValue, dispatch, getState }) => {
    try {
      // const semesterId = getState().common.user.classInfo.selectedSemester.id;
      const say = getAY();
      dispatch(setShowError(false));
      const res = await getData(`/student/studentAssignment/${aid}?say=${say}`);
      const data = res?.data;
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Submit new assignment
export const stdDoAssignment = createAsyncThunk(
  "assignment/stdDoAssignment",
  async (
    { assignmentId, editorContent, fileUrls,type },
    { rejectWithValue, dispatch }
  ) => {
    const submissionData = {
      content: editorContent,
      media: fileUrls,
      type,
      commentText: "No comments",
    };

    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await postData(
        `/student/studentAssignment/submit/${assignmentId}?say=${say}`,
        submissionData
      );

      dispatch(stdGetAssignment(assignmentId));
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Reattempt existing assignment
export const stdReattemptAssignment = createAsyncThunk(
  "assignment/stdReattemptAssignment",
  async (
    { aid, submissionContent, submissionType, submissionComment, fileUrls },
    { rejectWithValue, dispatch }
  ) => {
    const reattemptData = {
      content: submissionContent,
      type: submissionType,
      comment: submissionComment,
      media: fileUrls,
    };

    try {
      const say = getAY();
      dispatch(setShowError(false));
      const res = await putData(
        `/student/studentAssignment/reattempt/${aid}?say=${say}`,
        reattemptData
      );
      const data = res?.data;
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch filtered assignments by class, subject, module, or chapter
export const stdGetFilteredAssignment = createAsyncThunk(
  "assignment/stdGetFilteredAssignment",
  async (
    { cid, subjectId, moduleId, chapterId },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const semesterId = getState().common.user.classInfo.selectedSemester.id;
      const say = getAY();
      dispatch(setShowError(false));
      const res = await getData(
        `/student/studentAssignment/class/${cid}?say=${say}&semesterId=${semesterId}`,
        { subjectId, moduleId, chapterId }
      );
      const data = res?.data;
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
