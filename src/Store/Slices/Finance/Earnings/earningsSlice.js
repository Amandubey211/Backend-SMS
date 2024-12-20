// // src/store/finance/slices/earningsSlice.js
// import { createSlice } from "@reduxjs/toolkit";
// import {
//   fetchAllIncomes,
//   createCommunityExternalAffairRevenue,
//   updateCommunityExternalAffairRevenue,
//   createFinancialInvestmentRevenue,
//   updateFinancialInvestmentRevenue,
//   createServiceBasedRevenue,
//   updateServiceBasedRevenue,
//   createReceipt,
//   fetchAllReceipts,
//   updateReceipt,
//   cancelReceipt,
//   deleteReceipt,
//   createQuotation,
//   fetchAllQuotations,
//   updateQuotation,
//   cancelQuotation,
//   deleteQuotation,
//   createFacilityBasedIncome,
//   updateFacilityBasedIncome,
//   deleteFacilityBasedIncome,
//   fetchAllFacilityBasedIncomes,
// } from "./earningsThunks";

// const initialState = {
//   incomes: [],
//   facilityIncomes: [], // Ad
//   receipts: [],
//   quotations: [],
//   totalRecords: 0,
//   totalPages: 0,
//   currentPage: 1,
//   loading: false,
//   error: null,
// };

// const earningsSlice = createSlice({
//   name: "earnings",
//   initialState,
//   reducers: {
//     // Optional: Define synchronous actions here
//     clearIncomes: (state) => {
//       state.incomes = [];
//       state.facilityIncomes = [];
//       state.receipts = [];
//       state.quotations = [];
//       state.totalRecords = 0;
//       state.totalPages = 0;
//       state.currentPage = 1;
//       state.loading = false;
//       state.error = null;
//     },
//     setCurrentPage: (state, action) => {
//       state.currentPage = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     // -------------------
//     // Handle fetchAllIncomes
//     // -------------------
//     builder
//       .addCase(fetchAllIncomes.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllIncomes.fulfilled, (state, action) => {
//         state.loading = false;
//         state.incomes = action.payload.data;
//         state.totalRecords = action.payload.totalRecords;
//         state.totalPages = action.payload.totalPages;
//         state.currentPage = action.payload.currentPage;
//       })
//       .addCase(fetchAllIncomes.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch incomes.";
//       });

//     // -------------------
//     // Handle createCommunityExternalAffairRevenue
//     // -------------------
//     builder
//       .addCase(createCommunityExternalAffairRevenue.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         createCommunityExternalAffairRevenue.fulfilled,
//         (state, action) => {
//           state.loading = false;
//           // Prepend the new revenue to the incomes array
//           // state.incomes.unshift(action.payload.data);
//           // state.totalRecords += 1;
//         }
//       )
//       .addCase(
//         createCommunityExternalAffairRevenue.rejected,
//         (state, action) => {
//           state.loading = false;
//           state.error =
//             action.payload ||
//             "Failed to create Community External Affairs Revenue.";
//         }
//       );

//     // -------------------
//     // Handle updateCommunityExternalAffairRevenue
//     // -------------------
//     builder
//       .addCase(updateCommunityExternalAffairRevenue.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         updateCommunityExternalAffairRevenue.fulfilled,
//         (state, action) => {
//           state.loading = false;
//           const updatedRevenue = action.payload.data;
//           // const index = state.incomes.findIndex(
//           //   (income) => income._id === updatedRevenue._id
//           // );
//           // if (index !== -1) {
//           //   state.incomes[index] = updatedRevenue;
//           // }
//         }
//       )
//       .addCase(
//         updateCommunityExternalAffairRevenue.rejected,
//         (state, action) => {
//           state.loading = false;
//           state.error =
//             action.payload ||
//             "Failed to update Community External Affairs Revenue.";
//         }
//       );

//     // -------------------
//     // Handle createFinancialInvestmentRevenue
//     // -------------------
//     builder
//       .addCase(createFinancialInvestmentRevenue.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createFinancialInvestmentRevenue.fulfilled, (state, action) => {
//         state.loading = false;
//         // Prepend the new revenue to the incomes array
//         // state.incomes.unshift(action.payload.data);
//         // state.totalRecords += 1;
//       })
//       .addCase(createFinancialInvestmentRevenue.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           action.payload || "Failed to create Financial Investment Revenue.";
//       });

//     // -------------------
//     // Handle updateFinancialInvestmentRevenue
//     // -------------------
//     builder
//       .addCase(updateFinancialInvestmentRevenue.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateFinancialInvestmentRevenue.fulfilled, (state, action) => {
//         state.loading = false;
//         const updatedRevenue = action.payload.data;
//         // const index = state.incomes.findIndex(
//         //   (income) => income._id === updatedRevenue._id
//         // );
//         // if (index !== -1) {
//         //   state.incomes[index] = updatedRevenue;
//         // }
//       })
//       .addCase(updateFinancialInvestmentRevenue.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           action.payload || "Failed to update Financial Investment Revenue.";
//       });

//     // -------------------
//     // Handle createServiceBasedRevenue
//     // -------------------
//     builder
//       .addCase(createServiceBasedRevenue.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createServiceBasedRevenue.fulfilled, (state, action) => {
//         state.loading = false;
//         // Prepend the new revenue to the incomes array
//         // state.incomes.unshift(action.payload.data);
//         // state.totalRecords += 1;
//       })
//       .addCase(createServiceBasedRevenue.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           action.payload || "Failed to create Service-Based Revenue.";
//       });

//     // -------------------
//     // Handle updateServiceBasedRevenue
//     // -------------------
//     builder
//       .addCase(updateServiceBasedRevenue.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateServiceBasedRevenue.fulfilled, (state, action) => {
//         state.loading = false;
//         const updatedRevenue = action.payload.data;
//         // const index = state.incomes.findIndex(
//         //   (income) => income._id === updatedRevenue._id
//         // );
//         // if (index !== -1) {
//         //   state.incomes[index] = updatedRevenue;
//         // }
//       })
//       .addCase(updateServiceBasedRevenue.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           action.payload || "Failed to update Service-Based Revenue.";
//       });

//     // -------------------
//     // Handle fetchAllFacilityBasedIncomes
//     // -------------------
//     builder
//       .addCase(fetchAllFacilityBasedIncomes.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllFacilityBasedIncomes.fulfilled, (state, action) => {
//         state.loading = false;
//         state.facilityIncomes = action.payload.data;
//         state.totalRecords = action.payload.totalRecords;
//         state.totalPages = action.payload.totalPages;
//         state.currentPage = action.payload.currentPage;
//       })
//       .addCase(fetchAllFacilityBasedIncomes.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           action.payload || "Failed to fetch Facility-Based Incomes.";
//       });

//     // -------------------
//     // Handle createFacilityBasedIncome
//     // -------------------
//     builder
//       .addCase(createFacilityBasedIncome.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createFacilityBasedIncome.fulfilled, (state, action) => {
//         state.loading = false;
//         // Prepend the new facility income to the facilityIncomes array
//         state.facilityIncomes.unshift(action.payload.data);
//         state.totalRecords += 1;
//       })
//       .addCase(createFacilityBasedIncome.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           action.payload || "Failed to create Facility-Based Income.";
//       });

//     // -------------------
//     // Handle updateFacilityBasedIncome
//     // -------------------
//     builder
//       .addCase(updateFacilityBasedIncome.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateFacilityBasedIncome.fulfilled, (state, action) => {
//         state.loading = false;
//         const updatedIncome = action.payload.data;
//         const index = state.facilityIncomes.findIndex(
//           (income) => income._id === updatedIncome._id
//         );
//         if (index !== -1) {
//           state.facilityIncomes[index] = updatedIncome;
//         }
//       })
//       .addCase(updateFacilityBasedIncome.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           action.payload || "Failed to update Facility-Based Income.";
//       });

//     // -------------------
//     // Handle deleteFacilityBasedIncome
//     // -------------------
//     builder
//       .addCase(deleteFacilityBasedIncome.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteFacilityBasedIncome.fulfilled, (state, action) => {
//         state.loading = false;
//         const deletedId = action.payload;
//         state.facilityIncomes = state.facilityIncomes.filter(
//           (income) => income._id !== deletedId
//         );
//         state.totalRecords -= 1;
//       })
//       .addCase(deleteFacilityBasedIncome.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           action.payload || "Failed to delete Facility-Based Income.";
//       });
//     // -------------------
//     // Handle createReceipt
//     // -------------------
//     builder
//       .addCase(createReceipt.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createReceipt.fulfilled, (state, action) => {
//         state.loading = false;
//         // Prepend the new receipt to the receipts array
//         state.receipts.unshift(action.payload.data);
//         state.totalRecords += 1;
//       })
//       .addCase(createReceipt.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to create Receipt.";
//       });

//     // -------------------
//     // Handle fetchAllReceipts
//     // -------------------
//     builder
//       .addCase(fetchAllReceipts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllReceipts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.receipts = action.payload.data;
//         state.totalRecords = action.payload.totalRecords;
//         state.totalPages = action.payload.totalPages;
//         state.currentPage = action.payload.currentPage;
//       })
//       .addCase(fetchAllReceipts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch Receipts.";
//       });

//     // -------------------
//     // Handle updateReceipt
//     // -------------------
//     builder
//       .addCase(updateReceipt.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateReceipt.fulfilled, (state, action) => {
//         state.loading = false;
//         const updatedReceipt = action.payload.data;
//         const index = state.receipts.findIndex(
//           (receipt) => receipt._id === updatedReceipt._id
//         );
//         if (index !== -1) {
//           state.receipts[index] = updatedReceipt;
//         }
//       })
//       .addCase(updateReceipt.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to update Receipt.";
//       });

//     // -------------------
//     // Handle cancelReceipt
//     // -------------------
//     builder
//       .addCase(cancelReceipt.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(cancelReceipt.fulfilled, (state, action) => {
//         state.loading = false;
//         const updatedReceipt = action.payload.data;
//         const index = state.receipts.findIndex(
//           (receipt) => receipt._id === updatedReceipt._id
//         );
//         if (index !== -1) {
//           state.receipts[index] = updatedReceipt;
//         }
//       })
//       .addCase(cancelReceipt.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to cancel Receipt.";
//       });

//     // -------------------
//     // Handle deleteReceipt
//     // -------------------
//     builder
//       .addCase(deleteReceipt.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteReceipt.fulfilled, (state, action) => {
//         state.loading = false;
//         const deletedId = action.payload;
//         state.receipts = state.receipts.filter(
//           (receipt) => receipt._id !== deletedId
//         );
//         state.totalRecords -= 1;
//       })
//       .addCase(deleteReceipt.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to delete Receipt.";
//       });

//     // -------------------
//     // Handle createQuotation
//     // -------------------
//     builder
//       .addCase(createQuotation.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createQuotation.fulfilled, (state, action) => {
//         state.loading = false;
//         // Prepend the new quotation to the quotations array
//         state.quotations.unshift(action.payload.data);
//         state.totalRecords += 1;
//       })
//       .addCase(createQuotation.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to create Quotation.";
//       });

//     // -------------------
//     // Handle fetchAllQuotations
//     // -------------------
//     builder
//       .addCase(fetchAllQuotations.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllQuotations.fulfilled, (state, action) => {
//         state.loading = false;
//         state.quotations = action.payload.data;
//         state.totalRecords = action.payload.totalRecords;
//         state.totalPages = action.payload.totalPages;
//         state.currentPage = action.payload.currentPage;
//       })
//       .addCase(fetchAllQuotations.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch Quotations.";
//       });

//     // -------------------
//     // Handle updateQuotation
//     // -------------------
//     builder
//       .addCase(updateQuotation.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateQuotation.fulfilled, (state, action) => {
//         state.loading = false;
//         const updatedQuotation = action.payload.data;
//         const index = state.quotations.findIndex(
//           (quotation) => quotation._id === updatedQuotation._id
//         );
//         if (index !== -1) {
//           state.quotations[index] = updatedQuotation;
//         }
//       })
//       .addCase(updateQuotation.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to update Quotation.";
//       });

//     // -------------------
//     // Handle cancelQuotation
//     // -------------------
//     builder
//       .addCase(cancelQuotation.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(cancelQuotation.fulfilled, (state, action) => {
//         state.loading = false;
//         const updatedQuotation = action.payload.data;
//         const index = state.quotations.findIndex(
//           (quotation) => quotation._id === updatedQuotation._id
//         );
//         if (index !== -1) {
//           state.quotations[index] = updatedQuotation;
//         }
//       })
//       .addCase(cancelQuotation.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to cancel Quotation.";
//       });

//     // -------------------
//     // Handle deleteQuotation
//     // -------------------
//     builder
//       .addCase(deleteQuotation.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteQuotation.fulfilled, (state, action) => {
//         state.loading = false;
//         const deletedId = action.payload;
//         state.quotations = state.quotations.filter(
//           (quotation) => quotation._id !== deletedId
//         );
//         state.totalRecords -= 1;
//       })
//       .addCase(deleteQuotation.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to delete Quotation.";
//       });
//   },
// });

// export const { clearIncomes, setCurrentPage } = earningsSlice.actions;

// export default earningsSlice.reducer;
// src/store/slices/Finance/Earnings/earningsSlice.js
// src/store/slices/Finance/Earnings/earningsSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { fetchAllIncomes } from "./earningsThunks";

const initialState = {
  incomes: [],
  totalRecords: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 5, // Adjust as needed
  filters: {},
  loading: false,
  error: null,
};

const earningsSlice = createSlice({
  name: "earnings",
  initialState,
  reducers: {
    // Reset incomes
    clearIncomes: (state) => {
      state.incomes = [];
      state.totalRecords = 0;
      state.totalPages = 0;
      state.currentPage = 1;
      state.loading = false;
      state.error = null;
      state.filters = {};
    },
    // Set current page
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filters change
    },
    // Clear all filters
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIncomes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.incomes = action.payload || [];
        state.totalRecords = action.payload.totalRecords || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchAllIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch incomes.";
        state.incomes = []; // Clear incomes on error
        state.totalRecords = 0;
        state.totalPages = 0;
      });
  },
});

export const { clearIncomes, setCurrentPage, setFilters, clearFilters } =
  earningsSlice.actions;

export default earningsSlice.reducer;
