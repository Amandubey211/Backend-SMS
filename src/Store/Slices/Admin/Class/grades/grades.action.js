import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";

export const fetchSubjectGrades = createAsyncThunk("subject/gardes", async ({ classId, subjectId, filters }, { rejectWithValue, getState, }) => {
    const { common } = getState();
    const token = common.auth.token;
    try {
        const response = await axios.get(
            `${baseUrl}/admin/grades/class/${classId}/subject/${subjectId}/`,
            {
                headers: { Authentication: `Bearer ${token}` },
                params: filters,
            }
        );
            return response.data?.gradesResult;
    } catch (error) {
        toast.error("Something is wrong");
        return rejectWithValue(error.response?.data || error.message);
    }

})