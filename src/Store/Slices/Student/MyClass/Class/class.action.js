import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../../config/Common";
import axios from "axios";



export const stdClass = createAsyncThunk(
    'class/studentClass',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            rejectWithValue("Authentication failed!");
        }

        try {
            const res = await axios.get(`${baseUrl}/student/my_class`, {
                headers: {
                    Authentication: token,
                },
            });
           console.log("data in action class :",res.data.data)
            const data = res?.data?.data;
            return data;
        } catch (error) {
            console.log("Error in libraryBooksStudent", error);
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)