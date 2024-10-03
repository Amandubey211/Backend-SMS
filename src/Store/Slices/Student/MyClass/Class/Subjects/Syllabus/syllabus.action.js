import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";



export const stdSyllabus = createAsyncThunk(
    'syllabus/stdSyllabus',
    async ({ classId, subjectId }, { rejectWithValue, dispatch }) => {

        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            dispatch(setShowError(false));

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
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
        }
    }
)