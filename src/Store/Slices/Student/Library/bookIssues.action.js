import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";



export const studentIssueBooks = createAsyncThunk(
    'books/studentIssueBooks',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue("Authentication Failed!");
        }

        try {
            const res = await axios.get(`${baseUrl}/student/issue/books`, {
                headers: { Authentication: token }
            });
            const data = res.data;
            return data;
        }
        catch (error) {
            console.log("Error in studentIssueBooks", error);
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))

        }
    }
)

