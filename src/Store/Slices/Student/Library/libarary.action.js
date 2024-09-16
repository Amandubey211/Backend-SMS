import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";


export const libraryBooksStudent = createAsyncThunk(
    'books/libraryBooksStudent',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue(`Authentication failed!`);
        }
        try {

            const res = await axios.get(`${baseUrl}/admin/all/book`, {
                headers: { Authentication: token }
            });

            const data = res?.data;
            return data;

        }
        catch (error) {
            console.log("Error in libraryBooksStudent", error);
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)