import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";

export const stdPages = createAsyncThunk(
    'pages/stdPages',
    async ({ classId }, { rejectWithValue }) => {
        console.log("i am pages class",classId)
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const res = await axios.get(`${baseUrl}/admin/api/pages/class/pages/${classId}`, {
                headers: {
                    Authentication: token
                }
            });
            console.log("i am pages in action>>>>>>", res?.data?.data)
            const data = res?.data?.data;
            return data;

        } catch (error) {
            console.log("Error in student Pages", error);
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)