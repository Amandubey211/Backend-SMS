// src/Modules/Admin/Finance/Expense/AddExpense/Config/fieldMapping.js

import { formatDateForInput } from "../../../../../Utils/xl";

export const mapBackendToFrontend = (expenseData) => {
  return {
    _id: expenseData._id || "",
    categoryName: expenseData.category?.categoryName || "Salaries and Wages",
    sub_category: expenseData.subcategory || "",
    payment_type: expenseData.paymentType || "cash",
    receipt: expenseData.receipt || "",
    description: expenseData.description || "",
    paid_amount: expenseData.paidAmount || 0,
    total_amount: expenseData.totalAmount || 0,
    finalAmount: expenseData.finalAmount || 0,
    remaining_amount: expenseData.remainingAmount || 0,
    advanceAmount: expenseData.advanceAmount || 0,
    tax: expenseData.tax || 0,
    discountType: expenseData.discountType || "amount",
    discount: expenseData.discount || 0,
    penalty: expenseData.penalty || 0,
    document: expenseData.document || [],
    startDate: expenseData.startDate
      ? formatDateForInput(expenseData.startDate)
      : "",
    endDate: expenseData.endDate ? formatDateForInput(expenseData.endDate) : "",
    // purchasedDate: expenseData.purchasedDate
    //   ? formatDateForInput(expenseData.purchasedDate)
    //   : "",
    // Add more mappings as needed
    // For example, map nested fields or other specific cases
  };
};
