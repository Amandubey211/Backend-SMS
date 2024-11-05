import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";
import { setShowError ,setErrorMsg} from "../../../../../Common/Alerts/alertsSlice";
const say = localStorage.getItem("say");
export const stdSyllabus = createAsyncThunk(
    'syllabus/stdSyllabus',
    async ({ classId, subjectId }, { rejectWithValue, dispatch }) => {

        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            dispatch(setShowError(false));

            const res = await axios.get(`${baseUrl}/admin/syllabus/${subjectId}/class/${classId}?say=${say}`, {
                headers: {
                    Authentication: token
                }
            });
            console.log("i am sylllabus in action>>>>>>", res?.data)
            const data = res?.data?.data;
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)