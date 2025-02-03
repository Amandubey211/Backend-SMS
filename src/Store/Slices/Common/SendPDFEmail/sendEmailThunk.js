import { createAsyncThunk } from "@reduxjs/toolkit";
import { postData } from "../../../../services/apiEndpoints";
import toast from "react-hot-toast";
import { getUserRole } from "../../../../Utils/getRoles";

export const sendEmail = createAsyncThunk(
    "sendEmail/send",
    async ({ id, type, record }, { rejectWithValue }) => {
        try {
            const persistUserString = localStorage.getItem("persist:user");
            const persistUserObject = JSON.parse(persistUserString);
            const userDetails = JSON.parse(persistUserObject?.userDetails);
            const schoolId = userDetails?.schoolId;

            if (!id || !type || !record?.receiver?.email || !schoolId) {
                return rejectWithValue("Missing required fields");
            }

            // Handle discount calculation for receipts
            const isPercentage = record.discountType === "percentage";
            const discountAmount = isPercentage
                ? ((record.totalAmount || 0) * (record.discount || 0)) / 100
                : record.discount || 0;

            // Construct payload focused on receipts
            const payload = {
                receiver: { email: record.receiver.email },
                schoolId: schoolId,
                schoolName: record.schoolName || "",
                schoolAddress: record.schoolAddress || "",
                name: record.receiver?.name || "",
                email: record.receiver?.email || "",
                address: record.receiver?.address || "",
                phone: record.receiver?.phone || "",
                invoiceNumber: record.invoiceNumber || "", // This is fine for reference
                date: record.date || "",
                paymentType: record.paymentType || "",
                paymentStatus: record.paymentStatus || "",
                lineItems: record.lineItems.map((item) => ({
                    revenueType: item.revenueType || "",
                    quantity: item.quantity || 1,
                    rate: item.rate || 0,  // Changed to ‘rate’ since ‘amount’ is incorrect here
                    total: item.total || 0,
                })),
                totalAmount: record.totalAmount || 0,
                tax: record.tax || 0,
                penalty: record.penalty || 0,
                discount: record.discount || 0, // This is the only discount we’ll include
                discountType: record.discountType || "fixed",
                finalAmount: record.finalAmount || 0,
            };

            console.log("Sending email payload:", payload);

            const response = await postData(`/admin/invoice/send/${type}/${id}`, payload);

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

