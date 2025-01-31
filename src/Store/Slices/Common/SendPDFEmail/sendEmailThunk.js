import { createAsyncThunk } from "@reduxjs/toolkit";
import { postData } from "../../../../services/apiEndpoints";
import toast from "react-hot-toast";
import { getUserRole } from "../../../../Utils/getRoles";

export const sendEmail = createAsyncThunk(
    "sendEmail/send",
    async ({ id, type }, { rejectWithValue, getState }) => {
        try {
            const getRole = getUserRole(getState);
            const response = await postData(`/${getRole}/invoice/send/${type}/${id}`);

            if (response?.success) {
                toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} sent successfully!`);
                return response.message;
            } else {
                toast.error(response?.message || "Failed to send email.");
                return rejectWithValue(response?.message || "Failed to send email.");
            }
        } catch (error) {
            toast.error(error.message || "Error sending email.");
            return rejectWithValue(error.message || "Error sending email.");
        }
    }
);
