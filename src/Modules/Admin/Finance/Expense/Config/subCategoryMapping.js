// src/Modules/Admin/Finance/Expense/AddExpense/Config/subCategoryMapping.js

// Mapping from backend subcategory values to frontend labels
export const backendToFrontendSubCategoryMap = {
  // Salaries and Wages
  teaching: "Teaching Staffs",
  nonteaching: "Non-Teaching Staffs",

  // Utilities and Maintenance
  utility: "Utilities",
  maintenance: "Maintenance",

  // Add more mappings as needed
};

// Mapping from frontend subcategory labels to backend values
export const frontendToBackendSubCategoryMap = {
  "Teaching Staffs": "teaching",
  "Non-Teaching Staffs": "nonteaching",
  Utilities: "utility",
  Maintenance: "maintenance",

  // Add more mappings as needed
};
