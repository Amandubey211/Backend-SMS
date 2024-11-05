import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";
import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";

const say = localStorage.getItem("say");

const getToken = (state, rejectWithValue, dispatch) => {
    const token = state.common.auth?.token;
    if (!token) {
        dispatch(setShowError(true));
        dispatch(setErrorMsg('Authentication Failed'));
        return rejectWithValue('Authentication Failed');
    }
    return `Bearer ${token}`;
};

// Helper function for handling errors
const handleError = (error, dispatch, rejectWithValue) => {
    const err = ErrorMsg(error);
    dispatch(setShowError(true));
    dispatch(setErrorMsg(err.message));
    return rejectWithValue(err.message);
};

// Fetch Salaries with `say` and enhanced error handling
export const fetchSalaries = createAsyncThunk(
    "accounting/fetchSalaries",
    async ({ query, activeTab, month }, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;
        const say = localStorage.getItem("say")
        const year = new Date().getFullYear();
        let url = "";

        if (activeTab === "TeacherSalary") {
            url = `${baseUrl}/admin/staff/get_salary?salaryRole=teacher&status=${query}&month=${month}&year=${year}&say=${say}`;
        } else if (activeTab === "StaffSalary") {
            url = `${baseUrl}/admin/staff/get_salary?salaryRole=all&status=${query}&month=${month}&year=${year}&say=${say}`;
        } else if (activeTab === "OtherExpenses") {
            url = `${baseUrl}/api/admin/expenses?status=${query}&month=${month}&year=${year}&say=${say}`;
        }

        try {
            const response = await axios.get(url, { headers: { Authentication: token } });
            return { activeTab, data: activeTab.includes('Salary') ? response.data.salaryRecords : response.data.data };
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Fetch Expense by ID
export const fetchExpenseById = createAsyncThunk(
    "accounting/fetchExpensesById",
    async (id, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;
        const say = localStorage.getItem("say")
        try {
            const response = await axios.get(`${baseUrl}/api/admin/expenses/${id}?say=${say}`, {
                headers: { Authentication: token },
            });
            return response.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Delete Expense by ID
export const deleteExpenseById = createAsyncThunk(
    "accounting/deleteExpenseById",
    async (id, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;
        const say = localStorage.getItem("say")
        try {
            const response = await axios.delete(`${baseUrl}/api/admin/expenses/${id}?say=${say}`, {
                headers: { Authentication: token },
            });
            toast.success("Expense deleted successfully");
            return response.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Update Salary
export const updateSalary = createAsyncThunk(
    "accounting/updateSalary",
    async ({ salaryDetails }, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;
        const say = localStorage.getItem("say")
        try {
            const response = await axios.put(`${baseUrl}/admin/staff/update_salary?say=${say}`, salaryDetails, {
                headers: { Authentication: token },
            });
            toast.success("Salary updated successfully");
            return response.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Update Expense
export const updateExpense = createAsyncThunk(
    "accounting/updateExpense",
    async ({ expenseId, editExpense }, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;
        const say = localStorage.getItem("say")
        try {
            const response = await axios.put(`${baseUrl}/api/admin/expenses/${expenseId}?say=${say}`, editExpense, {
                headers: { Authentication: token },
            });
            toast.success("Expense updated successfully");
            return response.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Create Expense
export const createExpense = createAsyncThunk(
    "accounting/createExpense",
    async ({ payload }, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;
        const say = localStorage.getItem("say")
        try {
            const response = await axios.post(`${baseUrl}/api/admin/expenses/?say=${say}`, payload, {
                headers: { Authentication: token },
            });
            toast.success("Expense added successfully");
            return response.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }

);



// create salary

 export const createStaffSalary=createAsyncThunk(
    'salary/createStaffSalary',
    async({action,status},{rejectWithValue,getState,dispatch})=>{
        const token = getToken(getState());
        const body={action,status}
        try {
            const response = axios.post(`${baseUrl}/admin/staff/craete_salary`, body, {
                headers: {
                    Authentication: `${token}`,
                },
            })
            const data = response?.data
            // toast.success("Create Salary successfully")
            // console.log("salary data---", data);
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }
 )

