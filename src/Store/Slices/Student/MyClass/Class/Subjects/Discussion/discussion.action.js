import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../../../../config/Common";
import axios from "axios";
import toast from "react-hot-toast";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";
import { setShowError,setErrorMsg } from "../../../../../Common/Alerts/alertsSlice";

const say = localStorage.getItem("say");
export const fetchStudentDiscussion = createAsyncThunk(
    'discussion/fetchStudentDiscussion',
    async (cid, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            dispatch(setShowError(false));
            const response = await axios.get(
                `${baseUrl}/admin/getDiscussion/class/${cid}?say=${say}`,
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
            //return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)

export const updateStudentPinStatus = createAsyncThunk(
    'discussion/updateStudentPinStatus',
    async ({ discussionId, isPinned }, { rejectWithValue ,dispatch}) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }
        try {
            const response = await axios.put(
                `${baseUrl}/admin/discussion/pinstatus/${discussionId}?say=${say}`,
                { isPinned },
                {
                    headers: { Authentication: token },
                }
            );

            const data = response?.data
            toast.success(`Discussion ${isPinned ? "pinned" : "unpinned"} successfully`);
            return data;


        } catch (error) {
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)

export const markAsReadStudentDiscussion = createAsyncThunk(
    'discussion/markAsReadStudentDiscussion',
    async (discussionId, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }
        try {
            const response = await axios.put(
                `${baseUrl}/admin/discussion/readstatus/${discussionId}?say=${say}`,
                {},
                {
                    headers: { Authentication: token },
                }
            );

            const data = response?.data
            console.log("marks as read data--", response);
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)

export const fetchStudentDiscussionById = createAsyncThunk(
    'discussion/fetchStudentDiscussionById',
    async (did, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.get(
                `${baseUrl}/admin/getDiscussionById/${did}?say=${say}`,
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)

export const fetchStudentCommentsByDiscussion = createAsyncThunk(
    'discussion/fetchStudentCommentsByDiscussion',
    async ({ discussionId }, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.get(
                `${baseUrl}/admin/getDiscussionComment/${discussionId}?say=${say}`,
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("comments data---", data);
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)

export const createStudentDiscussionComment = createAsyncThunk(
    'discussion/createStudentDiscussionComment',
    async ({ discussionId, comment }, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.post(
                `${baseUrl}/admin/createCommentDiscussion/${discussionId}/replies?say=${say}`, { content: comment, parentId: null },
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("create comment response data---", data);
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)

export const createStudentDiscussionReply = createAsyncThunk(
    'discussion/createStudentDiscussionReply',
    async ({ discussionId, replyId, text }, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }
        console.log("discusdsion--",replyId);

        try {
            const response = await axios.post(
                `${baseUrl}/admin/createCommentDiscussion/${discussionId}/replies?say=${say}`, { content: text, parentId: replyId },
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)

export const deleteStudentDiscussionComment = createAsyncThunk(
    'discussion/deleteStudentDiscussionComment',
    async ({ commentId }, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.delete(
                `${baseUrl}/admin/deleteCommentDiscussion/${commentId}?say=${say}`,
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)

export const deleteStudentDiscussionReply = createAsyncThunk(
    'discussion/deleteStudentDiscussionReply',
    async (replyId, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.delete(
                `${baseUrl}/admin/deleteCommentDiscussion/${replyId}?say=${say}`,
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)

export const editStudentDiscussionComment = createAsyncThunk(
    'discussion/editStudentDiscussionComment',
    async ({ commentId, newText }, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.put(
                `${baseUrl}/admin/editCommentDiscussion/${commentId}?say=${say}`, { content: newText },
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)

export const editStudentDiscussionReply = createAsyncThunk(
    'discussion/editStudentDiscussionReply',
    async ({ replyId, newText }, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.put(
                `${baseUrl}/admin/editCommentDiscussion/${replyId}?say=${say}`, { content: newText },
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)

export const toggleLikeStudentDiscussion = createAsyncThunk(
    'discussion/toggleLikeStudentDiscussion',
    async ({ id }, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }
        console.log("token---", token);
        console.log("messageID--", id);

        try {
            const response = await axios.put(`${baseUrl}/admin/likeDiscussions/${id}?say=${say}`, {},
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)