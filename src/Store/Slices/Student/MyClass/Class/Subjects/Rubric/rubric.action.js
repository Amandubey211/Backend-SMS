import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../../../../Utils/academivYear";
import { getData } from "../../../../../../../services/apiEndpoints";

export const stdRubric = createAsyncThunk(
    'rubric/stdRubric',
    async ({ subjectId }, { rejectWithValue, dispatch, getState }) => {

        try {
            const semesterId = getState().common.user.classInfo.selectedSemester.id;
            const say = getAY();
            dispatch(setShowError(false));
            const res = await getData(`/admin/rubric/subject/${subjectId}?say=${say}&semesterId=${semesterId}`);

            const data = res?.rubrics;
            return data;

        } catch (error) {
            handleError(error, dispatch, rejectWithValue);
        }
    }
)

export const getStudentRubricByIdThunk = createAsyncThunk(
    "rubric/getStudentRubricById",
    async ({ id }, { getState, rejectWithValue }) => {
        const say = getAY();

        try {
            // Fetch the rubric by ID (assignmentId or quizId)
            const response = await getData(`/admin/rubric/${id}?say=${say}`);

            const { success, rubric } = response;

            return rubric
        } catch (error) {
            return rejectWithValue(error.message || "An error occurred");
        }
    }
);