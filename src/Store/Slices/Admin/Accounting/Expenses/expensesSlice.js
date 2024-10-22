import { createSlice } from "@reduxjs/toolkit"
import { createExpense, deleteExpenseById, fetchExpenseById, fetchSalaries, updateExpense, updateSalary } from "./expenses.action";

const initialState = {
    teacherSalaries: [],
    staffSalaries: [],
    otherExpenses: [],
    currentExpense: null,
    isSidebarOpen: false,
    loading: false,
    error: null,
}

const expensesSlice = createSlice({
    name: "admin/expensesSlice",
    initialState,
    reducers: {
        setIsSidebarOpen: (state, action) => {
            state.isSidebarOpen = action.payload;
        },
        setCurrentExpense: (state, action) => {
            state.currentExpense = action.payload;
        },

    },
    extraReducers: (builder) => {

        // fetching salaries data
        builder
            .addCase(fetchSalaries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSalaries.fulfilled, (state, action) => {
                state.loading = false;
                const { activeTab, data } = action.payload;
                if (activeTab === 'TeacherSalary') {
                    state.teacherSalaries = data;
                } else if (activeTab === 'StaffSalary') {
                    state.staffSalaries = data;
                } else if (activeTab === 'OtherExpenses') {
                    state.otherExpenses = data;
                }
            })
            .addCase(fetchSalaries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        // fetching expenses by Id
        builder
            .addCase(fetchExpenseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpenseById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentExpense = action.payload
            })
            .addCase(fetchExpenseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        // delete expenses
        builder
            .addCase(deleteExpenseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExpenseById.fulfilled, (state, action) => {
                state.loading = false;
                state.salaryData = state.otherExpenses.filter((expense) => expense.id !== action.payload);
            })
            .addCase(deleteExpenseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        // update salary
        builder
            .addCase(updateSalary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSalary.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateSalary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        // update expense
        builder
            .addCase(updateExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExpense.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        builder
            .addCase(createExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createExpense.fulfilled, (state) => {
                state.loading = false;
                //state.otherExpenses.push(action.payload);
            })
            .addCase(createExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
})


export const { setIsSidebarOpen, setCurrentExpense } = expensesSlice.actions;
export default expensesSlice.reducer;