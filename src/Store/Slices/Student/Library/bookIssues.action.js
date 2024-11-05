import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";

const say = localStorage.getItem("say");

export const studentIssueBooks = createAsyncThunk(
    'books/studentIssueBooks',
    async (_, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication Failed!"));
            return rejectWithValue("Authentication Failed!");
        }

        try {
            dispatch(setShowError(false));

            const res = await axios.get(`${baseUrl}/student/issue/books?say=${say}`, {
                headers: { Authentication: token }
            });
            const data = res.data;
            return data;
        } catch (error) {
            console.error("Error in studentIssueBooks:", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
);
