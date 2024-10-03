import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";



export const studentIssueBooks = createAsyncThunk(
    'books/studentIssueBooks',
    async (_, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            return rejectWithValue("Authentication Failed!");
        }

        try {
            dispatch(setShowError(false));

            const res = await axios.get(`${baseUrl}/student/issue/books`, {
                headers: { Authentication: token }
            });
            const data = res.data;
            return data;
        }
        catch (error) {
            console.log("Error in studentIssueBooks", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);

        }
    }
)

