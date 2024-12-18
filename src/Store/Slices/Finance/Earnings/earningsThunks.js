// // src/store/finance/thunks/earningsThunks.js
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   getData,
//   postData,
//   putData,
//   deleteData,
// } from "../../../../services/apiEndpoints";
// import { setShowError } from "../../Common/Alerts/alertsSlice";
// import { handleError } from "../../Common/Alerts/errorhandling.action";

// /**
//  * Fetch all incomes with query parameters.
//  * @param {Object} params - The query parameters for filtering, sorting, pagination, etc.
//  */
// export const fetchAllIncomes = createAsyncThunk(
//   "earnings/fetchAllIncomes",
//   async (params, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false)); // Hide any existing errors
//       const response = await getData("/finance/revenue/get-income", params);
//       console.log(response, "ddddddd");
//       return response.data; // Assuming response.data contains { data, totalRecords, totalPages, currentPage }
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Create a new Community External Affairs Revenue.
//  * @param {Object} incomeData - The data for the new revenue entry.
//  */
// export const createCommunityExternalAffairRevenue = createAsyncThunk(
//   "earnings/createCommunityExternalAffairRevenue",
//   async (incomeData, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const response = await postData(
//         "/finance/revenue/add/communityExternalAffairs",
//         incomeData
//       );
//       // Assuming the backend returns { success: true, data: createdData, message: "..." }
//       return response.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Update an existing Community External Affairs Revenue.
//  * @param {Object} payload - Contains the ID and updated data.
//  * @param {string} payload.id - The ID of the revenue entry to update.
//  * @param {Object} payload.updatedData - The updated revenue data.
//  */
// export const updateCommunityExternalAffairRevenue = createAsyncThunk(
//   "earnings/updateCommunityExternalAffairRevenue",
//   async ({ id, updatedData }, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const endpoint = `/finance/revenue/edit/communityExternalAffairs/${id}`;
//       const response = await putData(endpoint, updatedData);
//       // Assuming the backend returns { success: true, data: updatedData, message: "..." }
//       return response.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Create a new Financial Investment Revenue.
//  * @param {Object} incomeData - The data for the new revenue entry.
//  */
// export const createFinancialInvestmentRevenue = createAsyncThunk(
//   "earnings/createFinancialInvestmentRevenue",
//   async (incomeData, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const response = await postData(
//         "/finance/revenue/add/financialInvestment",
//         incomeData
//       );
//       // Assuming the backend returns { success: true, data: createdData, message: "..." }
//       return response.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Update an existing Financial Investment Revenue.
//  * @param {Object} payload - Contains the ID and updated data.
//  * @param {string} payload.id - The ID of the revenue entry to update.
//  * @param {Object} payload.updatedData - The updated revenue data.
//  */
// export const updateFinancialInvestmentRevenue = createAsyncThunk(
//   "earnings/updateFinancialInvestmentRevenue",
//   async ({ id, updatedData }, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const endpoint = `/finance/revenue/edit/financialInvestment/${id}`;
//       const response = await putData(endpoint, updatedData);
//       // Assuming the backend returns { success: true, data: updatedData, message: "..." }
//       return response.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Create a new Service-Based Revenue.
//  * @param {Object} incomeData - The data for the new revenue entry.
//  */
// export const createServiceBasedRevenue = createAsyncThunk(
//   "earnings/createServiceBasedRevenue",
//   async (incomeData, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const response = await postData(
//         "/finance/revenue/add/serviceBased",
//         incomeData
//       );
//       // Assuming the backend returns { success: true, data: createdData, message: "..." }
//       return response.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Update an existing Service-Based Revenue.
//  * @param {Object} payload - Contains the ID and updated data.
//  * @param {string} payload.id - The ID of the revenue entry to update.
//  * @param {Object} payload.updatedData - The updated revenue data.
//  */
// export const updateServiceBasedRevenue = createAsyncThunk(
//   "earnings/updateServiceBasedRevenue",
//   async ({ id, updatedData }, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const endpoint = `/finance/revenue/edit/serviceBased/${id}`;
//       const response = await putData(endpoint, updatedData);
//       // Assuming the backend returns { success: true, data: updatedData, message: "..." }
//       return response.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Create a new Receipt.
//  * @param {Object} receiptData - The data for the new receipt.
//  */
// export const createReceipt = createAsyncThunk(
//   "earnings/createReceipt",
//   async (receiptData, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const response = await postData(
//         "/finance/revenue/create/receipt",
//         receiptData
//       );
//       // Assuming the backend returns { success: true, data: createdReceipt, message: "..." }
//       return response.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Fetch all Receipts with query parameters.
//  * @param {Object} params - The query parameters for filtering, sorting, pagination, etc.
//  */
// export const fetchAllReceipts = createAsyncThunk(
//   "earnings/fetchAllReceipts",
//   async (params, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const response = await getData("/finance/revenue/all/receipt", params);
//       return response.data; // Assuming response.data contains { data, ... }
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Update an existing Receipt.
//  * @param {Object} payload - Contains the ID and updated data.
//  * @param {string} payload.id - The ID of the receipt to update.
//  * @param {Object} payload.updatedData - The updated receipt data.
//  */
// export const updateReceipt = createAsyncThunk(
//   "earnings/updateReceipt",
//   async ({ id, updatedData }, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const endpoint = `/finance/revenue/update/receipt/${id}`;
//       const response = await putData(endpoint, updatedData);
//       // Assuming the backend returns { success: true, data: updatedReceipt, message: "..." }
//       return response.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Cancel a Receipt.
//  * @param {string} id - The ID of the receipt to cancel.
//  */
// export const cancelReceipt = createAsyncThunk(
//   "earnings/cancelReceipt",
//   async (id, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const endpoint = `/finance/revenue/cancel/receipt/${id}`;
//       const response = await putData(endpoint, {}); // Assuming no body is needed
//       // Assuming the backend returns { success: true, data: updatedReceipt, message: "..." }
//       return response.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Delete a Receipt.
//  * @param {string} id - The ID of the receipt to delete.
//  */
// export const deleteReceipt = createAsyncThunk(
//   "earnings/deleteReceipt",
//   async (id, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const endpoint = `/finance/revenue/delete/receipt/${id}`;
//       await deleteData(endpoint);
//       // Return the deleted ID to remove it from the store
//       return id;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Create a new Quotation.
//  * @param {Object} quotationData - The data for the new quotation.
//  */
// export const createQuotation = createAsyncThunk(
//   "earnings/createQuotation",
//   async (quotationData, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const response = await postData(
//         "/finance/revenue/create/quotation",
//         quotationData
//       );
//       // Assuming the backend returns { success: true, data: createdQuotation, message: "..." }
//       return response.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Fetch all Quotations with query parameters.
//  * @param {Object} params - The query parameters for filtering, sorting, pagination, etc.
//  */
// export const fetchAllQuotations = createAsyncThunk(
//   "earnings/fetchAllQuotations",
//   async (params, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const response = await getData("/finance/revenue/all/quotation", params);
//       return response.data; // Assuming response.data contains { data, ... }
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Update an existing Quotation.
//  * @param {Object} payload - Contains the ID and updated data.
//  * @param {string} payload.id - The ID of the quotation to update.
//  * @param {Object} payload.updatedData - The updated quotation data.
//  */
// export const updateQuotation = createAsyncThunk(
//   "earnings/updateQuotation",
//   async ({ id, updatedData }, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const endpoint = `/finance/revenue/update/quotation/${id}`;
//       const response = await putData(endpoint, updatedData);
//       // Assuming the backend returns { success: true, data: updatedQuotation, message: "..." }
//       return response.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Cancel a Quotation.
//  * @param {string} id - The ID of the quotation to cancel.
//  */
// export const cancelQuotation = createAsyncThunk(
//   "earnings/cancelQuotation",
//   async (id, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const endpoint = `/finance/revenue/cancel/quotation/${id}`;
//       const response = await putData(endpoint, {}); // Assuming no body is needed
//       // Assuming the backend returns { success: true, data: updatedQuotation, message: "..." }
//       return response.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Delete a Quotation.
//  * @param {string} id - The ID of the quotation to delete.
//  */
// export const deleteQuotation = createAsyncThunk(
//   "earnings/deleteQuotation",
//   async (id, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const endpoint = `/finance/revenue/delete/quotation/${id}`;
//       await deleteData(endpoint);
//       // Return the deleted ID to remove it from the store
//       return id;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Fetch all Facility-Based Incomes with query parameters.
//  * @param {Object} params - The query parameters for filtering, sorting, pagination, etc.
//  */
// export const fetchAllFacilityBasedIncomes = createAsyncThunk(
//   "earnings/fetchAllFacilityBasedIncomes",
//   async (params, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false)); // Hide any existing errors
//       const response = await getData(
//         "/finance/revenue/get-income/facility",
//         params
//       );
//       return response.data; // Assuming response.data contains { data, totalRecords, totalPages, currentPage }
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Create a new Facility-Based Income.
//  * @param {Object} incomeData - The data for the new facility-based income entry.
//  */
// export const createFacilityBasedIncome = createAsyncThunk(
//   "earnings/createFacilityBasedIncome",
//   async (incomeData, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const response = await postData(
//         "/finance/revenue/facility/income",
//         incomeData
//       );
//       // Assuming the backend returns { success: true, data: createdData, message: "..." }
//       return response.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Update an existing Facility-Based Income.
//  * @param {Object} payload - Contains the ID and updated data.
//  * @param {string} payload.id - The ID of the income entry to update.
//  * @param {Object} payload.updatedData - The updated income data.
//  */
// export const updateFacilityBasedIncome = createAsyncThunk(
//   "earnings/updateFacilityBasedIncome",
//   async ({ id, updatedData }, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const endpoint = `/finance/revenue/facility/update-income/${id}`;
//       const response = await putData(endpoint, updatedData);
//       // Assuming the backend returns { success: true, data: updatedData, message: "..." }
//       return response.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// /**
//  * Delete a Facility-Based Income.
//  * @param {string} id - The ID of the income entry to delete.
//  */
// export const deleteFacilityBasedIncome = createAsyncThunk(
//   "earnings/deleteFacilityBasedIncome",
//   async (id, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(setShowError(false));
//       const endpoint = `/finance/revenue/facility/delete-income/${id}`;
//       await deleteData(endpoint);
//       // Return the deleted ID to remove it from the store
//       return id;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );
// src/store/slices/Finance/Earnings/earningsThunks.js

// src/store/slices/Finance/Earnings/earningsThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getData } from "../../../../services/apiEndpoints";

/**
 * Fetch all incomes with query parameters.
 * @param {Object} params - The query parameters for filtering, sorting, pagination, etc.
 */
export const fetchAllIncomes = createAsyncThunk(
  "earnings/fetchAllIncomes",
  async (params, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false)); // Hide any existing error alerts
      const response = await getData("/finance/revenue/get-income", params);

      // Check if the response indicates success
      if (response?.success) {
        return response.data;
      } else {
        // Reject with the error message from the backend
        return rejectWithValue(response.message || "Failed to fetch incomes.");
      }
    } catch (error) {
      // Handle unexpected errors
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
