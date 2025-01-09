// src/Components/Admin/Finance/Expenses/Config/formConfig.js

import TeachingStaffForm from "../AddExpense/ExpenseForms/TeachingStaffForm";
import NonTeachingStaffForm from "../AddExpense/ExpenseForms/NonTeachingStaffForm";
import UtilitiesForm from "../AddExpense/ExpenseForms/UtilitiesForm";
import BuildingMaintenanceForm from "../AddExpense/ExpenseForms/BuildingMaintenanceForm";
import ClassroomOfficePurposeForm from "../AddExpense/ExpenseForms/ClassroomOfficePurposeForm";
import DecorationsForm from "../AddExpense/ExpenseForms/DecorationsForm";
import BookPurchasesForm from "../AddExpense/ExpenseForms/BookPurchasesForm";
import PrintingExamPapersForm from "../AddExpense/ExpenseForms/PrintingExamPapersForm";
import LMSERPSubscriptionForm from "../AddExpense/ExpenseForms/LMSERPSubscriptionForm";
import SocialMediaAdsForm from "../AddExpense/ExpenseForms/SocialMediaAdsForm";
import LegalAuditFeesForm from "../AddExpense/ExpenseForms/LegalAuditFeesForm";

// Initial values for each subCategory with flat fields
export const initialValuesMap = {
  // Teaching Staffs
  "Teaching Staffs": {
    // Category-specific fields
    staffType: "teaching",
    staffId: "",

    // Base fields
    total_amount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    paid_amount: 0,
    remaining_amount: 0,
    advanceAmount: 0,
    receipt: "",
    paymentStatus: "unpaid",
    paymentType: "cash",

    // Additional fields
    recurringExpense: {
      isRecurring: false,
      frequency: "monthly",
      nextDueDate: null,
    },
    allowance: {},
    deduction: {},
    totalAllowance: 0,
    totalDeduction: 0,
    bonus: 0,
  },

  // Non-Teaching Staffs
  "Non-Teaching Staffs": {
    // Category-specific fields
    staffType: "nonteaching",
    staffId: "",

    // Base fields
    total_amount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    paid_amount: 0,
    remaining_amount: 0,
    advanceAmount: 0,
    receipt: "",
    paymentStatus: "unpaid",
    paymentType: "cash",

    // Additional fields
    recurringExpense: {
      isRecurring: false,
      frequency: "monthly",
      nextDueDate: null,
    },
    allowance: {},
    deduction: {},
    totalAllowance: 0,
    totalDeduction: 0,
    bonus: 0,
  },

  // Utilities
  Utilities: {
    // Category-specific fields
    utilityType: "electricity",
    name: "",
    vendor: "aman",
    description: "",
    expenseSubCategory: "utility",

    // Base fields
    total_amount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    paid_amount: 0,
    remaining_amount: 0,
    advanceAmount: 0,
    receipt: "",
    paymentStatus: "unpaid",
    paymentType: "cash",
  },

  // Maintenance
  Maintenance: {
    // Category-specific fields
    name: "Aman Sharma",
    vendor: "aman",
    expenseSubCategory: "maintenance",
    maintenanceCategory: "",
    description: "",

    // Base fields
    total_amount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    paid_amount: 0,
    remaining_amount: 0,
    advanceAmount: 0,
    receipt: "",
    paymentStatus: "unpaid",
    paymentType: "cash",
  },

  // Classroom & Office Purpose
  "Classroom & Office Purpose": {
    // Category-specific fields
    itemsPurchased: "",
    description: "",
    name: "Aman Sharma",
    vendor: "aman",
    items: [
      {
        itemName: "",
        unitPrice: 0,
        quantity: 1,
        unitType: "",
      },
    ],
    purchasedDate: "",

    // Base fields
    total_amount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    paid_amount: 0,
    remaining_amount: 0,
    advanceAmount: 0,
    receipt: "",
    paymentStatus: "unpaid",
    paymentType: "cash",
  },

  // Decorations
  Decorations: {
    // Category-specific fields
    eventName: "",
    startDate: "",
    endDate: "",
    itemsPurchased: "",
    description: "",
    name: "Aman Sharma",
    vendor: "aman",

    // Base fields
    total_amount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    paidAmount: 0,
    remaining_amount: 0,
    advanceAmount: 0,
    receipt: "",
    paymentStatus: "unpaid",
    paymentType: "cash",
  },

  // Book Purchases
  "Book Purchases": {
    // Category-specific fields
    bookTitle: "",
    name: "",
    vendor: "aman",
    items: [
      {
        itemName: "",
        unitPrice: 0,
        quantity: 1,
        unitType: "",
      },
    ],
    description: "",

    // Base fields
    total_amount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    paid_amount: 0,
    remaining_amount: 0,
    advanceAmount: 0,
    receipt: "",
    paymentStatus: "unpaid",
    paymentType: "cash",
  },

  // Printing Exam Papers
  "Printing Exam Papers": {
    // Category-specific fields
    name: "",
    vendor: "",
    description: "",
    vendorName: "",
    examRelatedCosts: [
      {
        itemName: "",
        cost: 0,
      },
    ],

    // Base fields
    total_amount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    paid_amount: 0,
    remaining_amount: 0,
    advanceAmount: 0,
    receipt: "",
    paymentStatus: "unpaid",
    paymentType: "cash",
  },

  // LMS/ERP Subscription
  "LMS/ERP Subscription": {
    // Category-specific fields
    name: "",
    vendor: "",
    Date: "",
    description: "",

    // Base fields
    total_amount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    paid_amount: 0,
    remaining_amount: 0,
    advanceAmount: 0,
    receipt: "",
    paymentStatus: "unpaid",
    paymentType: "cash",
  },

  // Legal and Audit Fees
  "Legal and Audit Fees": {
    // Category-specific fields
    name: "",
    vendor: "",

    // Base fields
    total_amount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    paid_amount: 0,
    remaining_amount: 0,
    advanceAmount: 0,
    receipt: "",
    paymentStatus: "unpaid",
    paymentType: "cash",
  },
};

// Form components mapping
export const formComponentsMap = {
  "Salaries and Wages": {
    "Teaching Staffs": TeachingStaffForm,
    "Non-Teaching Staffs": NonTeachingStaffForm,
  },
  "Utilities and Maintenance": {
    Utilities: UtilitiesForm,
    Maintenance: BuildingMaintenanceForm,
  },
  Supplies: {
    "Classroom & Office Purpose": ClassroomOfficePurposeForm,
  },
  "Event and Activity Costs": {
    Decorations: DecorationsForm,
  },
  "Library and Academic Resources": {
    "Book Purchases": BookPurchasesForm,
  },
  "IT and Software": {
    "LMS/ERP Subscription": LMSERPSubscriptionForm,
  },
  "Examination and Affiliation": {
    "Printing Exam Papers": PrintingExamPapersForm,
  },
  "Marketing and Advertising": {
    "Social Media Ads": SocialMediaAdsForm,
  },
  Miscellaneous: {
    "Legal and Audit Fees": LegalAuditFeesForm,
  },
};
