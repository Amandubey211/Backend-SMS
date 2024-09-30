import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";



export const stdSyllabus = createAsyncThunk(
    'syllabus/stdSyllabus',
    async ({ classId, subjectId }, { rejectWithValue }) => {
    
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
         
            const res = await axios.get(`${baseUrl}/admin/syllabus/${subjectId}/class/${classId}`, {
                headers: {
                    Authentication: token
                }
            });
            console.log("i am sylllabus in action>>>>>>", res?.data)
            const data = res?.data?.data;
            return data;

        } catch (error) {
            console.log("Error in student Syllabus", error);
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)