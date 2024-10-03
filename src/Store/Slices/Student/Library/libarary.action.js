import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";


export const libraryBooksStudent = createAsyncThunk(
    'books/libraryBooksStudent',
    async (_, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue(`Authentication failed!`);
        }
        try {
            dispatch(setShowError(false));

            const res = await axios.get(`${baseUrl}/admin/all/book`, {
                headers: { Authentication: token }
            });

            const data = res?.data;
            return data;

        }
        catch (error) {
            console.log("Error in libraryBooksStudent", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
        }
    }
)