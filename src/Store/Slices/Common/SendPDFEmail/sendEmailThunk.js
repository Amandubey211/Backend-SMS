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

            const isPercentage = record.discountType === "percentage";
            const discountAmount = isPercentage
                ? ((record.totalAmount || 0) * (record.discount || 0)) / 100
                : record.discount || 0;

            // Construct payload for receipts
            const payload = {
                receiver: {
                    email: record.receiver.email || "",
                    name: record.receiver.name || "N/A",
                    address: record.receiver.address || "N/A",
                    phone: record.receiver.phone || "N/A",
                },
                schoolId: schoolId,
                nameOfSchool: record.schoolId?.nameOfSchool || "N/A",
                schoolAddress: record.schoolId?.address || "N/A",
                branchName: record.schoolId?.branchName || "N/A",
                city: record.schoolId?.city || "N/A",
                receiptNumber: record.receiptNumber || "",
                invoiceNumber: record.invoiceNumber?.invoiceNumber || "",
                date: record.date || "",
                paymentMethod: record.paymentType || "N/A",
                paymentStatus: record.paymentStatus || "N/A",
                lineItems: record.lineItems.map((item) => ({
                    revenueType: item.revenueType || "N/A",
                    quantity: item.quantity || 1,
                    rate: item.total / (item.quantity || 1), // Fix rate calculation
                    total: item.total || 0,
                })),
                totalAmount: record.totalPaidAmount || 0, // Ensure it's `totalPaidAmount`
                tax: record.tax || 0,
                penalty: record.penalty || 0,
                discount: record.discount || 0,
                discountType: record.discountType || "fixed",
                finalAmount: record.finalAmount || 0,
            };

            console.log("Sending email payload:", JSON.stringify(payload, null, 2));

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


