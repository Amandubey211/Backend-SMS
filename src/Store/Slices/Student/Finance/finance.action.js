
import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../config/Common";
import axios from "axios";


// fetch student fees details
export const StudentFinanceDetails = createAsyncThunk(
  `fees/StudentFinanceDetails`,
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("student:token");
    if (!token) {
      return rejectWithValue(`Authentication failed!`);
    }
    try {
      const res = await axios.get(`${baseUrl}/student/my_fees`, {
        headers: { Authentication: token },
      });

      const data = res?.data;

      return  {
        "fees": [
          { "feeType": "Tuition", "paidBy": "Student Account", "dueDate": "9/15/2023", "amount": "5000 QR", "status": "Paid" },
          { "feeType": "Library", "paidBy": null, "dueDate": "9/20/2023", "amount": "200 QR", "status": "Unpaid" },
          { "feeType": "Transport", "paidBy": "Student Account", "dueDate": "9/25/2023", "amount": "150 QR", "status": "Paid" },
          { "feeType": "Sports", "paidBy": null, "dueDate": "9/30/2023", "amount": "300 QR", "status": "Unpaid" }
        ],
        "totalUnpaidFees": "500 QR",
        "totalPaidFees": "5150 QR"
      }
    } catch (error) {
      console.log("Error in StudentFinanceDetails:", error);
      // Return a detailed error message with `rejectWithValue` for better control
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)

