import { createAsyncThunk } from "@reduxjs/toolkit";
import {  setShowError } from "../../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../../Utils/academivYear";
import { getData } from "../../../../../../services/apiEndpoints";

export const stdSubjectProgressPercentage = createAsyncThunk(
    'progress/stdSubjectProgressPercentage',
    async ({studentId}, { rejectWithValue, dispatch }) => {
    
        try {
            const say=getAY();
            dispatch(setShowError(false));
            const res = await getData(`/admin/course/subjects/student/${studentId}?say=${say}`);
            const data= res?.data;
            return data;

        } catch (error) {
            handleError(error,dispatch,rejectWithValue);
        }
    }
)