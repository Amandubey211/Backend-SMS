import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../../../../config/Common";
import { setErrorMsg, setShowError } from "../../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../../Common/Alerts/errorhandling.action";

// Helper function to retrieve token and handle errors if token is missing
const getToken = (state, rejectWithValue, dispatch) => {
    const token = state.common.auth?.token;
    if (!token) {
        dispatch(setShowError(true));
        dispatch(setErrorMsg("Authentication Failed"));
        return rejectWithValue("Authentication Failed");
    }
    return `Bearer ${token}`;
};

// Centralized error handling
const handleError = (error, dispatch, rejectWithValue, defaultMessage) => {
    const err = ErrorMsg(error);
    dispatch(setShowError(true));
    dispatch(setErrorMsg(err.message || defaultMessage));
    toast.error(err.message || defaultMessage);
    return rejectWithValue(err.message || defaultMessage);
};

// Fetch comments for an announcement
export const fetchAnnouncementComments = createAsyncThunk(
    "announcementComments/fetchComments",
    async (announcementId, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === "object") return token;
        const say = localStorage.getItem("say")
        try {
            const response = await axios.get(
                `${baseUrl}/admin/getAnnouncementComment/${announcementId}`,
                { headers: { Authentication: token } }
            );
            if (response.data.status) {
                return response.data.data;
            } else {
                throw new Error("Failed to fetch comments");
            }
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue, "Error fetching comments");
        }
    }
);

// Add a new comment to an announcement
export const addAnnouncementComment = createAsyncThunk(
    "announcementComments/addComment",
    async ({ announcementId, text }, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === "object") return token;
        const say = localStorage.getItem("say")
        try {
            const response = await axios.post(
                `${baseUrl}/admin/createCommentAnnouncement/${announcementId}/replies`,
                { content: text, parentId: null },
                { headers: { Authentication: token } }
            );
            if (response.data.status) {
                toast.success("Comment added successfully");
                return response.data.data;
            } else {
                throw new Error("Failed to add comment");
            }
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue, "Error adding comment");
        }
    }
);

// Add a reply to a comment in an announcement
export const addAnnouncementReply = createAsyncThunk(
    "announcementComments/addReply",
    async ({ announcementId, parentId, text }, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === "object") return token;
        const say = localStorage.getItem("say")
        try {
            const response = await axios.post(
                `${baseUrl}/admin/createCommentAnnouncement/${announcementId}/replies`,
                { content: text, parentId },
                { headers: { Authentication: token } }
            );
            if (response.data.status) {
                toast.success("Reply added successfully");
                return { parentId, reply: response.data.data };
            } else {
                throw new Error("Failed to add reply");
            }
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue, "Error adding reply");
        }
    }
);

// Delete a comment from an announcement
export const deleteAnnouncementComment = createAsyncThunk(
    "announcementComments/deleteComment",
    async (commentId, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === "object") return token;
        const say = localStorage.getItem("say")
        try {
            const response = await axios.delete(
                `${baseUrl}/admin/deleteCommentAnnouncement/${commentId}`,
                { headers: { Authentication: token } }
            );
            if (response.data.status) {
                toast.success("Comment deleted successfully");
                return commentId;
            } else {
                throw new Error("Failed to delete comment");
            }
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue, "Error deleting comment");
        }
    }
);

// Toggle like for a comment in an announcement
export const toggleLikeAnnouncementComment = createAsyncThunk(
    "announcementComments/toggleLike",
    async (commentId, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === "object") return token;
        const say = localStorage.getItem("say")
        try {
            const response = await axios.put(
                `${baseUrl}/admin/likeAnnouncementComment/${commentId}`,
                {},
                { headers: { Authentication: token } }
            );
            if (response.data.status) {
                return commentId;
            } else {
                throw new Error("Failed to toggle like");
            }
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue, "Error toggling like");
        }
    }
);
