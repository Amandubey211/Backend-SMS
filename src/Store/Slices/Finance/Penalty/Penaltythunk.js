import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    ErrorMsg,
    handleError,
} from "../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../Common/Alerts/alertsSlice";
import toast from "react-hot-toast";
import { postData, putData, getData } from "../../../../services/apiEndpoints";
import { getUserRole } from "../../../../Utils/getRoles";
import { getAY } from "../../../../Utils/academivYear";

// ✅ Create Penalty
export const createPenalty = createAsyncThunk(
    "admin/createPenalty",
    async (penaltyData, { rejectWithValue, getState, dispatch }) => {
        try {
            dispatch(setShowError(false));
            const getRole = getUserRole(getState);
            const response = await postData(`/${getRole}/add/penalty`, penaltyData);
            return response;
        } catch (error) {
            toast.error(error.message || "Failed to create penalty");
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// ✏️ Update Penalty
export const updatePenalty = createAsyncThunk(
    "admin/updatePenalty",
    async ({ penaltyId, penaltyData }, { rejectWithValue, getState, dispatch }) => {
        try {
            dispatch(setShowError(false));
            const getRole = getUserRole(getState);
            // console.log("Update Data", penaltyData);
            const response = await putData(
                `/${getRole}/update/penalty/${penaltyId}`,
                penaltyData
            );
            return response;
        } catch (error) {
            toast.error(error.message || "Failed to update penalty");
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// 📄 Get All Penalties
export const getAllPenalties = createAsyncThunk(
    "admin/getAllPenalties",
    async ({ search, page, limit, isActive }, { rejectWithValue, getState, dispatch }) => {
        try {
            dispatch(setShowError(false));
            const getRole = getUserRole(getState);
            const say = getAY();
            const queryString = `/${getRole}/get/penalty?search=${search || ""}&page=${page || 1}&limit=${limit || 10}&isActive=${isActive === undefined ? "" : isActive}&say=${say || ""}`;
            // console.log("Fetching Penalties with URL:", queryString);
            const response = await getData(queryString);
            // console.log("Fetched Penalties Response:", response);
            return response;
        } catch (error) {
            console.error("Error in getAllPenalties:", error);
            toast.error(error.message || "Failed to fetch penalties");
            return rejectWithValue(error.message || "Failed to fetch penalties");
        }
    }
);
