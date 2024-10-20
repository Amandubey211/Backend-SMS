import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../../../../config/Common";
import axios from "axios";
import toast from "react-hot-toast";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";


export const fetchStudentDiscussion = createAsyncThunk(
    'discussion/fetchStudentDiscussion',
    async (cid, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            dispatch(setShowError(true));
            return rejectWithValue("Authentication failed!");
        }

        try {
            dispatch(setShowError(false));
            const response = await axios.get(
                `${baseUrl}/admin/getDiscussion/class/${cid}`,
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            console.log("Error in student discussion", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
            //return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)

export const updateStudentPinStatus = createAsyncThunk(
    'discussion/updateStudentPinStatus',
    async ({ discussionId, isPinned }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue("Authentication failed!");
        }
        try {
            const response = await axios.put(
                `${baseUrl}/admin/discussion/pinstatus/${discussionId}`,
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
    async (discussionId, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue("Authentication failed!");
        }
        try {
            const response = await axios.put(
                `${baseUrl}/admin/discussion/readstatus/${discussionId}`,
                {},
                {
                    headers: { Authentication: token },
                }
            );

            const data = response?.data
            console.log("marks as read data--", response);
            return data;

        } catch (error) {
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)

export const fetchStudentDiscussionById = createAsyncThunk(
    'discussion/fetchStudentDiscussionById',
    async (did, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.get(
                `${baseUrl}/admin/getDiscussionById/${did}`,
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)

export const fetchStudentCommentsByDiscussion = createAsyncThunk(
    'discussion/fetchStudentCommentsByDiscussion',
    async ({ discussionId }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.get(
                `${baseUrl}/admin/getDiscussionComment/${discussionId}`,
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("comments data---", data);
            return data;

        } catch (error) {
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)

export const createStudentDiscussionComment = createAsyncThunk(
    'discussion/createStudentDiscussionComment',
    async ({ discussionId, comment }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.post(
                `${baseUrl}/admin/createCommentDiscussion/${discussionId}/replies`, { content: comment, parentId: null },
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("create comment response data---", data);
            return data;

        } catch (error) {
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)

export const createStudentDiscussionReply = createAsyncThunk(
    'discussion/createStudentDiscussionReply',
    async ({ discussionId, replyId, text }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }
        console.log("discusdsion--",replyId);

        try {
            const response = await axios.post(
                `${baseUrl}/admin/createCommentDiscussion/${discussionId}/replies`, { content: text, parentId: replyId },
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)

export const deleteStudentDiscussionComment = createAsyncThunk(
    'discussion/deleteStudentDiscussionComment',
    async ({ commentId }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.delete(
                `${baseUrl}/admin/deleteCommentDiscussion/${commentId}`,
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)

export const deleteStudentDiscussionReply = createAsyncThunk(
    'discussion/deleteStudentDiscussionReply',
    async (replyId, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.delete(
                `${baseUrl}/admin/deleteCommentDiscussion/${replyId}`,
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)

export const editStudentDiscussionComment = createAsyncThunk(
    'discussion/editStudentDiscussionComment',
    async ({ commentId, newText }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.put(
                `${baseUrl}/admin/editCommentDiscussion/${commentId}`, { content: newText },
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)

export const editStudentDiscussionReply = createAsyncThunk(
    'discussion/editStudentDiscussionReply',
    async ({ replyId, newText }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.put(
                `${baseUrl}/admin/editCommentDiscussion/${replyId}`, { content: newText },
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)

export const toggleLikeStudentDiscussion = createAsyncThunk(
    'discussion/toggleLikeStudentDiscussion',
    async ({ id }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue("Authentication failed!");
        }
        console.log("token---", token);
        console.log("messageID--", id);

        try {
            const response = await axios.put(`${baseUrl}/admin/likeDiscussions/${id}`, {},
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)