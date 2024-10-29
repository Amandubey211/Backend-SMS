import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";
import { setShowError,setErrorMsg } from "../../../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";
const say = localStorage.getItem("say");
// Fetch assignment details
export const stdGetAssignment = createAsyncThunk(
  "assignment/stdGetAssignment",
  async (aid, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("student:token");
    if (!token) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Authentication failed!"));
      return rejectWithValue("Authentication failed!");
    }

    try {
      dispatch(setShowError(false));
      const res = await axios.get(
        `${baseUrl}/student/studentAssignment/${aid}?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );
      const data = res?.data?.data;
      return data;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err.message));
      return rejectWithValue(err.message);
    }
  }
);

// Submit new assignment
export const stdDoAssignment = createAsyncThunk(
  "assignment/stdDoAssignment",
  async (
    { assignmentId, editorContent, fileUrls },
    { rejectWithValue, dispatch }
  ) => {
    const token = localStorage.getItem("student:token");
    if (!token) {
      dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
      return rejectWithValue("Authentication failed!");
    }

    const submissionData = {
      content: editorContent,
      media: fileUrls,
      type: "Media Upload",
      comment: "No comments",
    };

    try {
      dispatch(setShowError(false));
      const res = await axios.post(
        `${baseUrl}/student/studentAssignment/submit/${assignmentId}?say=${say}`,
        submissionData,
        { headers: { Authentication: token } }
      );
      const data = res?.data;
      dispatch(stdGetAssignment(assignmentId));
      return data;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err.message));
      return rejectWithValue(err.message);
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
    const token = localStorage.getItem("student:token");
    if (!token) {
      dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
      return rejectWithValue("Authentication failed!");
    }

    const reattemptData = {
      content: submissionContent,
      type: submissionType,
      comment: submissionComment,
      media: fileUrls,
    };

    try {
      dispatch(setShowError(false));
      const res = await axios.put(
        `${baseUrl}/student/studentAssignment/reattempt/${aid}?say=${say}`,
        reattemptData,
        { headers: { Authentication: token } }
      );
      const data = res?.data?.data;
      return data;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err.message));
      return rejectWithValue(err.message);
    }
  }
);

// Fetch filtered assignments by class, subject, module, or chapter
export const stdGetFilteredAssignment = createAsyncThunk(
  "assignment/stdGetFilteredAssignment",
  async (
    { cid, subjectId, moduleId, chapterId },
    { rejectWithValue, dispatch }
  ) => {
    const token = localStorage.getItem("student:token");
    if (!token) {
      dispatch(setShowError(true));
      dispatch(setErrorMsg("Authentication failed!"));
      return rejectWithValue("Authentication failed!");
    }

    try {
      dispatch(setShowError(false));
      const res = await axios.get(
        `${baseUrl}/student/studentAssignment/class/${cid}?say=${say}`,
        {
          headers: { Authentication: token },
          params: { subjectId, moduleId, chapterId },
        }
      );
      const data = res?.data?.data;
      return data;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err.message));
      return rejectWithValue(err.message);
    }
  }
);
