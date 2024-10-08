import { createSlice } from "@reduxjs/toolkit"
import { createStudentFee, fetchClasses, fetchFees } from "./studentFees.action"

const initialState = {
    feesData: [],
    classes: [],
    isSidebarOpen: false,
    isSidebarEditOpen: false,
    filters: {
        class: "",
        feesType: "",
        status: "Everyone",
    },
    loading: false,
    error: null,
    editFormData: {
        feeId: "",
        feeType: "",
        dueDate: "",
        amount: null,
        status: "unpaid",
    },
    formData: {
        class: '',
        section: '',
        studentId: '',
        feesType: '',
        dueDate: '',
        amount: 0
    },
    isModalOpen: false,
}


const studentFeesSlice = createSlice({
    name: "admin/StudentFeesSlice",
    initialState,
    reducers: {
        setSidebarOpen: (state, action) => {
            state.isSidebarOpen = action.payload
        },
        setSidebarEditOpen: (state, action) => {
            state.isSidebarEditOpen = action.payload
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setEditFormData: (state, action) => {
            state.editFormData = action.payload;
        },
        resetFilters: (state) => {
            state.filters = { class: "", feesType: "", status: "Everyone" };
        },
        setModalOpen: (state, action) => {
            state.isModalOpen = action.payload;
        },
        setFormData: (state, action) => {
            state.formData = action.payload;
        },
        resetFormData: (state) => {
            state.formData = initialState.formData; // Reset formData
        },
    },
    extraReducers: (builder) => {

        // Fetch feesData
        builder
            .addCase(fetchFees.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchFees.fulfilled, (state, action) => {
                state.loading = false;
                state.feesData = action.payload;
            })
            .addCase(fetchFees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })

        // Fetch Classes
        builder
            .addCase(fetchClasses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClasses.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = action.payload;
            })
            .addCase(fetchClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });


        // create Student Fee
        builder
            .addCase(createStudentFee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStudentFee.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createStudentFee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });

    }
})

export const { setSidebarOpen, setEditFormData, setSidebarEditOpen, setFilters, resetFilters, setModalOpen, setFormData, resetFormData } = studentFeesSlice.actions;
export default studentFeesSlice.reducer;