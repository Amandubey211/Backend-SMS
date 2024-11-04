import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";
const say = localStorage.getItem("say");
 export const fetchAllAssignment = createAsyncThunk("subject/AllAssignment",async ({ subjectId,params} , { rejectWithValue, getState, }) => {
    const { common } = getState();
    const token = common.auth.token;
    try {

        const response = await axios.get(
            `${baseUrl}/admin/assignments/${subjectId}?say=${say}`,
            {
                headers: {
                    Authentication: `Bearer ${token}`,
                },
                params:params

            }
        );


        return response.data.assignments;

    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }

})