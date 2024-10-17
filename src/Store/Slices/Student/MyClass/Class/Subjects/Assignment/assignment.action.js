import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";
import { baseUrl } from "../../../../../../../config/Common";



export const stdGetAssignment = createAsyncThunk(
    'assignment/stdGetAssignment',
    async (aid, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            return rejectWithValue('Authentication failed!');
        }

        try {
            dispatch(setShowError(false));
            const res = await axios.get(`${baseUrl}/student/studentAssignment/${aid}`, {
                headers: {
                    Authentication: token
                }
            });

            const data = res?.data?.data;
            console.log("assifhn--", data);
            return data;
        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
        }
    }
)

export const stdDoAssignment = createAsyncThunk(
    'assignment/stdDoAssignment',
    async ({ assignmentId, editorContent, fileUrls }, { rejectWithValue, dispatch }) => {

        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            return rejectWithValue('Authentication failed!');
        }

        const submissionData = {
            content: editorContent,
            media: fileUrls,
            type: 'Media Upload',
            comment: 'No comments',
        };

        try {
            dispatch(setShowError(false));

            const res = await axios.post(`${baseUrl}/student/studentAssignment/submit/${assignmentId}`, submissionData, {
                headers: {
                    Authentication: token
                }
            });
            const data = res?.data;
            return data


        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
        }
    }
)

export const stdGetFilteredAssignment = createAsyncThunk(
    'assignment/stdGetFilteredAssignment',
    async ({ cid, subjectId, moduleId, chapterId }, { rejectWithValue, dispatch }) => {

        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            return rejectWithValue('Authentication failed!');
        }

        try {
            dispatch(setShowError(false));
            const response = await axios.get(
                `${baseUrl}/student/studentAssignment/class/${cid}`,
                {
                    headers: { Authentication: token },
                    params: { subjectId, moduleId, chapterId },
                }
            );
            const data = response?.data?.data;

            return data
        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
        }
    }
)

export const stdReattemptAssignment = createAsyncThunk(
    'assignment/stdReattemptAssignment',
    async ({ aid, submissionContent, submissionType, submissionComment, fileUrls }, { rejectWithValue, dispatch }) => {

        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            return rejectWithValue('Authentication failed!');
        }

        try {
            dispatch(setShowError(false));
            const response = await axios.put(
                `${baseUrl}/student/studentAssignment/reattempt/${aid}`,
                {
                    content: submissionContent,
                    type: submissionType,
                    comment: submissionComment,
                    media: fileUrls,
                },
                {
                    headers: { Authentication: token },
                    //params: { subjectId, moduleId, chapterId },
                }
            );
            const data = response?.data?.data;
            return data
        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
        }
    }
)