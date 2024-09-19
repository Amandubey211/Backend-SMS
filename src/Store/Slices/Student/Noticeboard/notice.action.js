import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../config/Common";
import axios from "axios";


export const studentNotice = createAsyncThunk(
    'announcement/studentNotice',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue(`Authentication failed!`);
        }
        try {

            const res = await axios.get(`${baseUrl}/admin/all/notices`, {
                headers: { Authentication: token }
            });

            const data = res?.data;

            const formatedData = data?.notices?.map((notice) => ({
                ...notice,
                startDate: new Date(notice.startDate),
                endDate: new Date(notice.endDate),

            }))
            return formatedData;

        }
        catch (error) {
            console.log("Error in libraryBooksStudent", error);
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)