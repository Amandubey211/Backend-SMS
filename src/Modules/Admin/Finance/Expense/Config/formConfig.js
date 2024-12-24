// src/Components/Admin/Finance/Expenses/Config/formConfig.js

import TeachingStaffForm from "../AddExpense/ExpenseForms/TeachingStaffForm";
import NonTeachingStaffForm from "../AddExpense/ExpenseForms/NonTeachingStaffForm";
import UtilitiesForm from "../AddExpense/ExpenseForms/UtilitiesForm";
import BuildingMaintenanceForm from "../AddExpense/ExpenseForms/BuildingMaintenanceForm";
import FurnitureMaintenanceForm from "../AddExpense/ExpenseForms/FurnitureMaintenanceForm";
import ITSoftwareForm from "../AddExpense/ExpenseForms/ITSoftwareForm";
import FuelCostsForm from "../AddExpense/ExpenseForms/FuelCostsForm";
import ClassroomOfficePurposeForm from "../AddExpense/ExpenseForms/ClassroomOfficePurposeForm";
import CanteenSuppliesForm from "../AddExpense/ExpenseForms/CanteenSuppliesForm";
import DecorationsForm from "../AddExpense/ExpenseForms/DecorationsForm";
import EquipmentRentalsForm from "../AddExpense/ExpenseForms/EquipmentRentalsForm";
import PrizesAndGiftsForm from "../AddExpense/ExpenseForms/PrizesAndGiftsForm";
import BookPurchasesForm from "../AddExpense/ExpenseForms/BookPurchasesForm";
import DigitalResourcesForm from "../AddExpense/ExpenseForms/DigitalResourcesForm";
import PrintingExamPapersForm from "../AddExpense/ExpenseForms/PrintingExamPapersForm";
import ExaminationInvigilatorForm from "../AddExpense/ExpenseForms/ExaminationInvigilatorForm";
import AffiliationFeesForm from "../AddExpense/ExpenseForms/AffiliationFeesForm";
import LMSERPSubscriptionForm from "../AddExpense/ExpenseForms/LMSERPSubscriptionForm";
import WebsiteMaintenanceForm from "../AddExpense/ExpenseForms/WebsiteMaintenanceForm";
import SoftwareLicensingForm from "../AddExpense/ExpenseForms/SoftwareLicensingForm";
import SocialMediaAdsForm from "../AddExpense/ExpenseForms/SocialMediaAdsForm";
import BrochuresPamphletsForm from "../AddExpense/ExpenseForms/BrochuresPamphletsForm";
import LegalAuditFeesForm from "../AddExpense/ExpenseForms/LegalAuditFeesForm";
import InsurancePremiumForm from "../AddExpense/ExpenseForms/InsurancePremiumForm";
import CanteenEquipmentMaintenanceForm from "../AddExpense/ExpenseForms/CanteenEquipmentMaintenanceForm";

// Initial values for each subCategory with flat fields
export const initialValuesMap = {
  "Teaching Staffs": {
    employeeName: "Jane Doe", // Full name of the employee
    staffId: "TS2024-001", // Unique staff identifier
    salaryAmount: "7500", // Gross salary amount (as a string if needed)
    paymentDate: "2024-12-25", // Date of payment (YYYY-MM-DD format)
    jobTitle: "Senior Mathematics Teacher", // Job title of the employee
    department: "Mathematics", // Department the employee belongs to
    phoneNumber: "555-1234-567", // Contact phone number
    email: "jane.doe@example.com", // Contact email address
    address: "123 Elm Street, Springfield", // Residential address
    accountNumber: "9876543210", // Bank account number for salary deposit
    accountHolderName: "Jane Doe", // Name of the account holder
    ifsc: "IFSC0001234", // IFSC code of the bank branch
    bankName: "Springfield Bank", // Name of the bank
    branchName: "Downtown Branch", // Specific branch name
    baseSalary: 7500, // Base salary amount (number)
    tax: 750, // Tax deducted (number)
    deduction: 150, // Other deductions (number)
    penalty: 0, // Penalties, if any (number)
    bonus: 500, // Bonus amount, if any (number)
    netSalary: 7500 - 750 - 150 + 500, // Calculated net salary (number)
    paymentStatus: "Paid", // Status of the payment (e.g., Paid, Pending)
    paymentType: "Direct Deposit", // Method of payment (e.g., Direct Deposit, Cheque)
    paidAmount: 5100, // Amount actually paid (number)
    advanceAmount: 0, // Any advance amount given (number)
    remainingAmount: 0, // Any remaining amount to be paid (number)
    receipt: "receipts/jane_doe_2024-12-25.pdf", // Path or URL to the payment receipt
  },

  "Non-Teaching Staffs": {
    employeeName: "",
    staffID: "",
    salaryAmount: "",
    paymentDate: "",
    jobTitle: "",
    department: "",
    phoneNumber: "",
    email: "",
    address: "",
    accountNumber: "",
    accountHolderName: "",
    ifsc: "",
    bankName: "",
    branchName: "",
    baseSalary: 0,
    tax: 0,
    deduction: 0,
    penalty: 0,
    bonus: 0,
    netSalary: 0,
    paymentStatus: "",
    paymentType: "",
    paidAmount: 0,
    advanceAmount: 0,
    remainingAmount: 0,
    receipt: null,
  },
  Utilities: {
    utilityType: "",
    billNumber: "",
    serviceProvider: "",
    dueDate: "",
    unitConsumption: 0,
    unitCost: 0,
    billingPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "Building Maintenance": {
    buildingName: "",
    services: "",
    vendorName: "",
    billingPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "Furniture Maintenance": {
    buildingName: "",
    furnitureType: "",
    expenseType: "",
    vendorName: "",
    billingPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "IT Equipment Maintenance": {
    // Added new subcategory
    equipmentType: "",
    expenseType: "",
    vendorName: "",
    billingPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "IT and Software": {
    buildingName: "",
    equipmentType: "",
    expenseType: "",
    vendorName: "",
    billingPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "Fuel Costs": {
    vehicleType: "",
    vehicleNumber: "",
    fuelType: "",
    fuelQuantity: 0,
    costPerLitre: 0,
    billingPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "Classroom & Office Purpose": {
    itemsPurchased: "",
    vendorName: "",
    billNumber: "",
    billingPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "Canteen Supplies": {
    suppliesType: "",
    serviceProvider: "",
    description: "",
    billingPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  Decorations: {
    eventName: "",
    decorativeItems: "",
    totalBanners: 0,
    totalPosters: 0,
    description: "",
    serviceProvider: "",
    billingPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "Equipment Rentals": {
    eventName: "",
    equipmentType: "",
    rentalStartDate: "",
    rentalEndDate: "",
    description: "",
    serviceProvider: "",
    billingPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  PrizesAndGifts: {
    eventName: "",
    totalPrizes: 0,
    totalGifts: 0,
    totalCertificates: 0,
    description: "",
    serviceProvider: "",
    billingPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "Book Purchases": {
    bookTitle: "",
    subject: "",
    quantity: 0,
    costPerBook: 0,
    description: "",
    serviceProvider: "",
    // Add Billing Details and Payment Status fields if necessary
  },
  "Digital Resources": {
    resourceName: "",
    resourceType: "",
    accessModel: "",
    description: "",
    serviceProvider: "",
    // Add Billing Details and Payment Status fields if necessary
  },
  "Printing Exam Papers": {
    examType: "",
    description: "",
    vendorName: "",
    numberOfCopies: 0,
    costPerCopy: 0,
    billingPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "Examination Invigilator Payments": {
    invigilatorName: "",
    examType: "",
    sessionDateTime: "",
    salaryPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "Affiliation Fees": {
    governingBodyName: "",
    paymentType: "",
    membershipDueDate: "",
    description: "",
    subscriptionPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "LMS/ERP Subscription": {
    platformName: "",
    numberOfUsers: 0,
    costPerUser: 0,
    subscriptionPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "Website Maintenance": {
    maintenanceType: "",
    dateOfService: "",
    description: "",
    subscriptionPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "Software Licensing": {
    softwareName: "",
    licenseType: "",
    dateOfPurchase: "",
    dateOfRenewal: "",
    description: "",
    subscriptionPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "Social Media Ads": {
    platformName: "",
    campaignName: "",
    description: "",
    subscriptionPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "Brochures & Pamphlets": {
    materialType: "",
    designCost: 0,
    printCost: 0,
    numberOfCopies: 0,
    description: "",
    supplierName: "",
    subscriptionPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
  },
  "Legal and Audit Fees": {
    serviceName: "",
    serviceProvider: "",
    description: "",
    subscriptionPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
    paymentStatus: "",
    paidAmount: 0,
    paidBy: "",
    paymentType: "",
    chequeNumber: "",
    transactionId: "",
    advanceAmount: 0,
    remainingAmount: 0,
  },
  "Insurance Premium": {
    insuranceType: "",
    premiumAmount: 0,
    coverageStartDate: "",
    coverageEndDate: "",
    description: "",
    subscriptionPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
    paymentStatus: "",
    paidAmount: 0,
    paidBy: "",
    paymentType: "",
    chequeNumber: "",
    transactionId: "",
    advanceAmount: 0,
    remainingAmount: 0,
  },
  "Canteen Equipment Maintenance": {
    equipmentName: "",
    premiumAmount: 0,
    coverageStartDate: "",
    coverageEndDate: "",
    description: "",
    subscriptionPeriod: "",
    dateTime: "",
    totalAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    receipt: null,
    paymentStatus: "",
    paidAmount: 0,
    paidBy: "",
    paymentType: "",
    chequeNumber: "",
    transactionId: "",
    advanceAmount: 0,
    remainingAmount: 0,
  },
};

// Form components mapping
export const formComponentsMap = {
  "Salaries and Wages": {
    "Teaching Staffs": TeachingStaffForm,
    "Non-Teaching Staffs": NonTeachingStaffForm,
  },
  "Utilities and Maintenance": {
    // Updated main category name
    Utilities: UtilitiesForm,
    "Building Maintenance": BuildingMaintenanceForm,
    "Furniture Maintenance": FurnitureMaintenanceForm,
    "IT Equipment Maintenance": ITSoftwareForm, // Ensures consistency with initialValuesMap
    "Fuel Costs": FuelCostsForm, // Changed from "Transport Maintenance" to "Fuel Costs" for consistency
  },
  Supplies: {
    "Classroom & Office Purpose": ClassroomOfficePurposeForm, // Updated subcategory name for clarity
    "Canteen Supplies": CanteenSuppliesForm,
  },
  "Event and Activity Costs": {
    // Updated main category name
    Decorations: DecorationsForm,
    "Equipment Rentals": EquipmentRentalsForm,
    "Prizes and Gifts": PrizesAndGiftsForm,
  },
  "Library and Academic Resources": {
    "Book Purchases": BookPurchasesForm,
    "Digital Resources": DigitalResourcesForm,
  },
  "Examination and Affiliation": {
    "Printing Exam Papers": PrintingExamPapersForm,
    "Examination Invigilator Payments": ExaminationInvigilatorForm, // Updated subcategory name for consistency
    "Affiliation Fees": AffiliationFeesForm,
  },
  "IT and Software": {
    "LMS/ERP Subscription": LMSERPSubscriptionForm,
    "Website Maintenance": WebsiteMaintenanceForm,
    "Software Licensing": SoftwareLicensingForm,
  },
  "Marketing and Advertising": {
    "Social Media Ads": SocialMediaAdsForm,
    "Brochures & Pamphlets": BrochuresPamphletsForm,
  },
  Miscellaneous: {
    "Legal and Audit Fees": LegalAuditFeesForm,
    "Insurance Premium": InsurancePremiumForm,
    "Canteen Equipment Maintenance": CanteenEquipmentMaintenanceForm,
  },
};
