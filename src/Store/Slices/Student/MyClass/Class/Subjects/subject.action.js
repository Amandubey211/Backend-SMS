import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../config/Common";


export const stdSubjectProgressPercentage = createAsyncThunk(
    'progress/stdSubjectProgressPercentage',
    async ({studentId}, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue('Authentication failed!');
        }
        try {
            const res = await axios.get(`${baseUrl}/admin/course/subjects/student/${studentId}`, {
                headers: { Authentication: token }
            });
            const data= res?.data?.data;
           console.log('progress data ===>>',data)
            return data;

        } catch (error) {
            console.log(error)
        }
    }
)