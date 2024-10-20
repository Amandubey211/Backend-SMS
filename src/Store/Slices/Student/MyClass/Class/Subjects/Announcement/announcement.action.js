import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";

export const fetchStudentAnnounce = createAsyncThunk(
    'announce/fetchStudentAnnounce',
    async (cid, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            dispatch(setShowError(true));
            return rejectWithValue("Authentication failed!");
        }

        try {
            dispatch(setShowError(false));
            const response = await axios.get(
                `${baseUrl}/admin/announcement/class/${cid}`,
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
            return rejectWithValue(err.message);
            //return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)

export const fetchStudentAnnounceById = createAsyncThunk(
    'announce/fetchStudentAnnounceById',
    async (aid, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.get(
                `${baseUrl}/admin/announcement/${aid}`,
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

export const markAsReadStudentAnnounce = createAsyncThunk(
    'announce/markAsReadStudentAnnounce',
    async (id, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.put(
                `${baseUrl}/admin/markAsRead/announcement/${id}`,
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

// comments api's
export const fetchStudentAnnounceComments = createAsyncThunk(
    'announce/fetchStudentAnnounceComments',
    async ({ aid }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.get(
                `${baseUrl}/admin/getAnnouncementComment/${aid}`,
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

export const createStudentAnnounceComment = createAsyncThunk(
    'announce/createStudentAnnounceComment',
    async ({ aid, text }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.post(
                `${baseUrl}/admin/createCommentAnnouncement/${aid}/replies`, { content: text, parentId: null },
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

export const createStudentAnnounceReply = createAsyncThunk(
    'announce/createStudentAnnounceReply',
    async ({ aid, replyId, text }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.post(
                `${baseUrl}/admin/createCommentAnnouncement/${aid}/replies`, { content: text, parentId: replyId },
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

export const deleteStudentAnnounceComment = createAsyncThunk(
    'announce/deleteStudentAnnounceComment',
    async ({ commentId }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.delete(
                `${baseUrl}/admin/deleteCommentannouncement/${commentId}`,
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

export const deleteStudentAnnounceReply = createAsyncThunk(
    'announce/deleteStudentAnnounceComment',
    async ({ replyId }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.delete(
                `${baseUrl}/admin/deleteCommentannouncement/${replyId}`,
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

export const editStudentAnnounceComment = createAsyncThunk(
    'announce/editStudentAnnounceComment',
    async ({ commentId, newText }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.put(
                `${baseUrl}/admin/editCommentAnnouncement/${commentId}`, { content: newText },
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

export const editStudentAnnounceReply = createAsyncThunk(
    'announce/editStudentAnnounceReply',
    async ({ replyId, newText }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.put(
                `${baseUrl}/admin/editCommentAnnouncement/${replyId}`, { content: newText },
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

export const toggleStudentAnnounceLike = createAsyncThunk(
    'announce/toggleStudentAnnounceLike',
    async ({ id }, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");

        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const response = await axios.put(
                `${baseUrl}/admin/likeAnnouncementComment/${id}`, {},
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