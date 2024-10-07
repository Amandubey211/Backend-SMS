import { updateEarning, fetchEarning, fetchTotalAmounts, createEarning, deleteEarning } from "./earning.action";

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    earningData: [],
    totalEarnings: 0,
    totalExpense: 0,
    totalFees: 0,
    remainingBalance: 0,
    loading: false,
    error: false,
    isEditSidebarOpen: false,
    openDropdown: null,
    editEarning: null,
    isSidebarOpen: false,
    formData: {
        paymentDate: '',
        amount: '',
        description: '',
        paymentStatus: '',
        paymentFrom: '',
    }
}

const earningSlice = createSlice({
    name: "admin/EarningSlice",
    initialState,
    reducers: {
        setIsEditSidebarOpen: (state, action) => {
            state.isEditSidebarOpen = action.payload
        },
        setEditEarning: (state, action) => {
            state.editEarning = action.payload
        },
        setOpenDropDown: (state, action) => {
            state.openDropdown = action.payload
        },
        setSidebarOpen: (state, action) => {
            state.isSidebarOpen = action.payload
        },
        setFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload }; // Update formData
        },
        resetFormData: (state) => {
            state.formData = initialState.formData; // Reset formData
        },
    },
    extraReducers: (builder) => {

        //fetching earnings data
        builder
            .addCase(fetchEarning.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchEarning.fulfilled, (state, action) => {
                state.loading = false;
                state.earningData = action.payload;
            })
            .addCase(fetchEarning.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })


        // fetching overall earning stats
        builder
            .addCase(fetchTotalAmounts.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchTotalAmounts.fulfilled, (state, action) => {
                state.loading = false;
                state.totalEarnings = action.payload.totalEarning;
                state.totalExpense = action.payload.totalExpense;
                state.totalFees = action.payload.totalFees;
                state.remainingBalance = action.payload.remainingBalance;
            })
            .addCase(fetchTotalAmounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })


        builder
            .addCase(updateEarning.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateEarning.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.earningData.findIndex((earning) => earning._id === action.payload._id);
                if (index !== -1) {
                    state.earningData[index] = action.payload; // Update the earning in the array
                }
            })
            .addCase(updateEarning.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })

        // create Earning--
        builder
            .addCase(createEarning.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEarning.fulfilled, (state, action) => {
                state.loading = false;
                state.earningData.push(action.payload); // Add the new earning to the state
            })
            .addCase(createEarning.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });


        // delete Earning --

        builder
            // Delete earning cases
            .addCase(deleteEarning.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEarning.fulfilled, (state, action) => {
                state.loading = false;
                const earningId = action.meta.arg.earningId;
                state.earningData = state.earningData.filter(earning => earning._id !== earningId);  // Remove the deleted earning
            })
            .addCase(deleteEarning.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    }
})

export const { setIsEditSidebarOpen, setEditEarning, setOpenDropDown, setSidebarOpen, setFormData, resetFormData } = earningSlice.actions;
export default earningSlice.reducer;