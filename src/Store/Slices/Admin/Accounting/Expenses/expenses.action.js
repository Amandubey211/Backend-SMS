import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../../config/Common";
import axios from "axios";
import toast from "react-hot-toast";


const getToken = (state) => {
    const token = state.common.auth?.token;
    if (!token) {
        throw new Error("Authentication token is missing.");
    }
    return `Bearer ${token}`;
};


export const fetchSalaries = createAsyncThunk(
    "accounting/fetchSalaries",
    async ({ query, activeTab, month }, { rejectWithValue, getState }) => {
        const token = getToken(getState());
        const year = new Date().getFullYear();
        try {
            let url = "";
            if (activeTab === "TeacherSalary") {
                url = `${baseUrl}/admin/staff/get_salary?salaryRole=teacher&status=${query}&month=${month}&year=${year}`;
            } else if (activeTab === "StaffSalary") {
                url = `${baseUrl}/admin/staff/get_salary?salaryRole=all&status=${query}&month=${month}&year=${year}`;
            } else if (activeTab === "OtherExpenses") {
                url = `${baseUrl}/api/admin/expenses?status=${query}&month=${month}&year=${year}`;
            }

            const response = await axios.get(url, {
                headers: {
                    Authentication: `${token}`,
                },
            });

            if (activeTab === 'TeacherSalary' || activeTab === 'StaffSalary') {
                //console.log("response---", response.data.salaryRecords);
                //console.log("activeTab---", activeTab);
                return { activeTab, data: response.data.salaryRecords };
            } else {
                //console.log("activeTab---", activeTab);
                return { activeTab, data: response.data.data };
            }

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }

)

export const fetchExpenseById = createAsyncThunk(
    "accounting/fetchExpensesById",
    async (id, { rejectWithValue, getState }) => {
        const token = getToken(getState());
        try {
            const response = axios.get(`${baseUrl}/api/admin/expenses/${id}`, {
                headers: {
                    Authentication: `${token}`,
                },
            })

            const data = response?.data
            //console.log("data---", data);
            return data

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }
)

export const deleteExpenseById = createAsyncThunk(
    "accounting/deleteExpenseById",
    async (id, { rejectWithValue, getState }) => {
        const token = getToken(getState());
        try {
            const response = axios.delete(`${baseUrl}/api/admin/expenses/${id}`, {
                headers: {
                    Authentication: `${token}`,
                },
            })
            const data = response?.data
            toast.success("Expense deleted successfully")
            //console.log("data---", data);
            return data

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }
)

export const updateSalary = createAsyncThunk(
    "accounting/updateSalary",
    async ({ salaryDetails }, { rejectWithValue, getState }) => {
        const token = getToken(getState());
        try {
            const response = axios.put(`${baseUrl}/admin/staff/update_salary`, salaryDetails, {
                headers: {
                    Authentication: `${token}`,
                },
            })
            const data = response?.data
            toast.success("Salary updated successfully")
            //console.log(" response data---", response);
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }
)

export const updateExpense = createAsyncThunk(
    "accounting/updateExpense",
    async ({ expenseId, editExpense }, { rejectWithValue, getState }) => {
        const token = getToken(getState());
        try {
            const response = axios.put(`${baseUrl}/api/admin/expenses/${expenseId}`, editExpense, {
                headers: {
                    Authentication: `${token}`,
                },
            })
            const data = response?.data
            //console.log(" response data---", response);
            toast.success("Expense Updated successfully")
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }
)

export const createExpense = createAsyncThunk(
    "accounting/createExpense",
    async ({ payload }, { rejectWithValue, getState }) => {
        const token = getToken(getState());
        try {
            const response = axios.post(`${baseUrl}/api/admin/expenses/`, payload, {
                headers: {
                    Authentication: `${token}`,
                },
            })
            const data = response?.data
            toast.success("Expense added successfully")
            //console.log("data---", data);
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }
)