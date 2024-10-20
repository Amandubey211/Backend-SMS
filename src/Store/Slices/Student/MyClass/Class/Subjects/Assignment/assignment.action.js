import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";
import { setShowError } from "./assignmentSlice";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";

// Fetch assignment details
export const stdGetAssignment = createAsyncThunk(
  "assignment/stdGetAssignment",
  async (aid, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("student:token");
    if (!token) {
      dispatch(setShowError(true));
      return rejectWithValue("Authentication failed!");
    }

    try {
      dispatch(setShowError(false));
      const res = await axios.get(
        `${baseUrl}/student/studentAssignment/${aid}`,
        {
          headers: { Authentication: token },
        }
      );
      const data = res?.data?.data;
      return data;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      return rejectWithValue(err.message || "Failed to fetch assignment");
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
        `${baseUrl}/student/studentAssignment/submit/${assignmentId}`,
        submissionData,
        { headers: { Authentication: token } }
      );
      const data = res?.data;
      dispatch(stdGetAssignment(assignmentId));
      return data;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      return rejectWithValue(err.message || "Failed to submit assignment");
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
        `${baseUrl}/student/studentAssignment/reattempt/${aid}`,
        reattemptData,
        { headers: { Authentication: token } }
      );
      const data = res?.data?.data;
      return data;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      return rejectWithValue(err.message || "Failed to reattempt assignment");
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
      return rejectWithValue("Authentication failed!");
    }

    try {
      dispatch(setShowError(false));
      const res = await axios.get(
        `${baseUrl}/student/studentAssignment/class/${cid}`,
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
      return rejectWithValue(
        err.message || "Failed to fetch filtered assignments"
      );
    }
  }
);
