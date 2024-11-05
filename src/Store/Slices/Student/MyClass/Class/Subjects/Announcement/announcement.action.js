import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError,setErrorMsg } from "../../../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";
const say = localStorage.getItem("say");
export const fetchStudentAnnounce = createAsyncThunk(
    'announce/fetchStudentAnnounce',
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
                `${baseUrl}/admin/announcement/class/${cid}?say=${say}`,
                {
                    headers: { Authentication: token },
                }
            );
            const data = response?.data?.data;
            console.log("response data---", data);
            return data;

        } catch (error) {
            console.log("Error in student Announcement", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
            //return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)

export const fetchStudentAnnounceById = createAsyncThunk(
    'announce/fetchStudentAnnounceById',
    async (aid, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
           
        }

        try {
            const response = await axios.get(
                `${baseUrl}/admin/announcement/${aid}?say=${say}`,
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

export const markAsReadStudentAnnounce = createAsyncThunk(
    'announce/markAsReadStudentAnnounce',
    async (id, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.put(
                `${baseUrl}/admin/markAsRead/announcement/${id}?say=${say}`,
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

// comments api's
export const fetchStudentAnnounceComments = createAsyncThunk(
    'announce/fetchStudentAnnounceComments',
    async ({ aid }, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.get(
                `${baseUrl}/admin/getAnnouncementComment/${aid}?say=${say}`,
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

export const createStudentAnnounceComment = createAsyncThunk(
    'announce/createStudentAnnounceComment',
    async ({ aid, text }, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.post(
                `${baseUrl}/admin/createCommentAnnouncement/${aid}/replies?say=${say}`, { content: text, parentId: null },
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

export const createStudentAnnounceReply = createAsyncThunk(
    'announce/createStudentAnnounceReply',
    async ({ aid, replyId, text }, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.post(
                `${baseUrl}/admin/createCommentAnnouncement/${aid}/replies?say=${say}`, { content: text, parentId: replyId },
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

export const deleteStudentAnnounceComment = createAsyncThunk(
    'announce/deleteStudentAnnounceComment',
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
                `${baseUrl}/admin/deleteCommentannouncement/${commentId}?say=${say}`,
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

export const deleteStudentAnnounceReply = createAsyncThunk(
    'announce/deleteStudentAnnounceComment',
    async ({ replyId }, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.delete(
                `${baseUrl}/admin/deleteCommentannouncement/${replyId}?say=${say}`,
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

export const editStudentAnnounceComment = createAsyncThunk(
    'announce/editStudentAnnounceComment',
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
                `${baseUrl}/admin/editCommentAnnouncement/${commentId}?say=${say}`, { content: newText },
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

export const editStudentAnnounceReply = createAsyncThunk(
    'announce/editStudentAnnounceReply',
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
                `${baseUrl}/admin/editCommentAnnouncement/${replyId}?say=${say}`, { content: newText },
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

export const toggleStudentAnnounceLike = createAsyncThunk(
    'announce/toggleStudentAnnounceLike',
    async ({ id }, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.put(
                `${baseUrl}/admin/likeAnnouncementComment/${id}?say=${say}`, {},
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