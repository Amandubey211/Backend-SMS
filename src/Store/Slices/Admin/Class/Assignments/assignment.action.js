import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";

 export const fetchAllAssignment = createAsyncThunk("subject/AllAssignment",async ({ subjectId,params} , { rejectWithValue, getState, }) => {
    const { common } = getState();
    const token = common.auth.token;
    try {

        const response = await axios.get(
            `${baseUrl}/admin/assignments/${subjectId}`,
            {
                headers: {
                    Authentication: `Bearer ${token}`,
                },
                params:params

            }
        );


        return response.data.assignments;

    } catch (error) {
        toast.error("Something is wrong");
        return rejectWithValue(error.response?.data || error.message);
    }

})