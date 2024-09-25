import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../config/Common";


export const stdClassmate = createAsyncThunk(
    'classmate/studentClassmate',
    async ({classId}, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue("Authentication failed!");
        }
        try {
            const res = await axios.get(`${baseUrl}/student/my_classmates/${classId}`, {
                headers: {
                    Authentication: token
                }
            });
            console.log("classmate data in action", res.data);
            const data = res?.data?.data;
            return data;

        } catch (error) {
            console.log("Error in student class teacher", error);
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)