import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";
import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";





export const stdGetQuiz = createAsyncThunk(
    'quiz/stdGetQuiz',
    async ({ cid, sid, moduleId, chapterId }, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            return rejectWithValue('Authentication failed!')
        }

        try {
            dispatch(setShowError(false));

            const res = await axios.get(`${baseUrl}/student/studentquiz/class/${cid}`, {
                headers: { Authentication: token },
                params: { subjectId:sid, moduleId, chapterId },
            });

            const data = res?.data?.quizzes;
            console.log("get quiz data>>>", data);
            return data;
        } catch (error) {
            console.log("Error in student get quiz", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
        }
    }
)