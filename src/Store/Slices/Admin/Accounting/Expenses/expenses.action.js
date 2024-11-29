import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {  setShowError } from "../../../Common/Alerts/alertsSlice";
import {  handleError } from "../../../Common/Alerts/errorhandling.action";
import { deleteData, getData, postData, putData } from "../../../../../services/apiEndpoints";
import { getAY } from "../../../../../Utils/academivYear";


// Fetch Salaries with `say` and enhanced error handling
export const fetchSalaries = createAsyncThunk(
    "accounting/fetchSalaries",
    async ({ query, activeTab, month }, { rejectWithValue, dispatch }) => {
        const say = getAY();
        dispatch(setShowError(false));
        const year = new Date().getFullYear();
        let url = "";

        if (activeTab === "TeacherSalary") {
            url = `/admin/staff/get_salary?salaryRole=teacher&status=${query}&month=${month}&year=${year}&say=${say}`;
        } else if (activeTab === "StaffSalary") {
            url = `/admin/staff/get_salary?salaryRole=all&status=${query}&month=${month}&year=${year}&say=${say}`;
        } else if (activeTab === "OtherExpenses") {
            url = `/api/admin/expenses?status=${query}&month=${month}&year=${year}&say=${say}`;
        }

        try {
            const response = await getData(url);

            return { activeTab, data: activeTab.includes('Salary') ? response?.salaryRecords : response?.data };
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Fetch Expense by ID
export const fetchExpenseById = createAsyncThunk(
    "accounting/fetchExpensesById",
    async (id, { rejectWithValue, dispatch }) => {

        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await getData(`/api/admin/expenses/${id}?say=${say}`);
            return response;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Delete Expense by ID
export const deleteExpenseById = createAsyncThunk(
    "accounting/deleteExpenseById",
    async (id, { rejectWithValue, getState, dispatch }) => {

        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await deleteData(`/api/admin/expenses/${id}?say=${say}`);
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
    async ({ salaryDetails }, { rejectWithValue, dispatch }) => {
        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await putData(`/admin/staff/update_salary?say=${say}`, salaryDetails);
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
    async ({ expenseId, editExpense }, { rejectWithValue, dispatch }) => {

        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await putData(`/api/admin/expenses/${expenseId}?say=${say}`, editExpense);
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
    async ({ payload }, { rejectWithValue, dispatch }) => {
        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await postData(`/api/admin/expenses/?say=${say}`, payload);
            toast.success("Expense added successfully");
            return response.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }

);



// create salary

export const createStaffSalary = createAsyncThunk(
    'salary/createStaffSalary',
    async ({ action, status }, { rejectWithValue, dispatch }) => {
        try {
            const say = getAY();
            const body = { action, status }
            dispatch(setShowError(false));
            const response = postData(`/admin/staff/craete_salary?say=${say}`, body)
            const data = response?.data
            // toast.success("Create Salary successfully")
            // // console.log("salary data---", data);
            return data
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
)

