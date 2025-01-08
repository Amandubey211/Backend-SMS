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
    staffType: "teaching",
    staffId: "",
    // email: "jane.doe@example.com", // Contact email address

    // base fields
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
  },

  "Non-Teaching Staffs": {
    staffType: "nonteaching",
    staffId: "",
    // email: "jane.doe@example.com", // Contact email address
    // base fields
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
  },
  Utilities: {
    // utilities fields
    utilityType: "electricity",
    name: "Aman Sharma",
    vendor: "aman",
    description: "",
    expenseSubCategory: "utility",

    // base fields
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
  },
  "Building Maintenance": {
    // utilities fields
    utilityType: "other",
    name: "Aman Sharma",
    vendor: "aman",
    expenseSubCategory: "maintenance",
    maintenanceCategory: "building",
    description: "",

    // base fields
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
  },
  "Furniture Maintenance": {
    name: "Aman Sharma",
    vendor: "aman",
    utilityType: "other",
    expenseSubCategory: "utility",
    maintenanceCategory: "furniture",
    description: "",

    // -------------------
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
  },
  "IT Equipment Maintenance": {
    // utilities fields
    utilityType: "internet",
    name: "Aman Sharma",
    vendor: "aman",
    expenseSubCategory: "maintenance",
    description: "",

    // base fields
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
  },
  // "IT and Software": {
  //   buildingName: "",
  //   equipmentType: "",
  //   expenseType: "",
  //   vendorName: "",
  //   billingPeriod: "",
  //   dateTime: "",
  //   totalAmount: 0,
  //   tax: 0,
  //   discount: 0,
  //   penalty: 0,
  //   final_amount: 0,
  //   receipt: null,
  // },
  "Fuel Costs": {
    vehicleType: "",
    // utilities fields
    utilityType: "gas",
    name: "Aman Sharma",
    vendor: "aman",
    expenseSubCategory: "maintenance",
    maintenanceCategory: "transport",
    description: "",

    // base fields
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
  },
  "Classroom & Office Purpose": {
    itemsPurchased: "",
    description: "",
    name: "Aman Sharma",
    vendor: "aman",
    items: [
      {
        itemName: "",
        unitPrice: 0, // Initialize as number
        quantity: 1, // Initialize as number with a default value
        unitType: "",
      },
    ],
    purchasedDate: "",
    // base fields
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
  },
  "Canteen Supplies": {
    itemsPurchased: "",
    description: "",
    name: "Aman Sharma",
    vendor: "aman",
    items: [
      {
        itemName: "",
        unitPrice: 0, // Initialize as number
        quantity: 1, // Initialize as number with a default value
        unitType: "",
      },
    ],
    purchasedDate: "",
    // base fields
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
  },
  Decorations: {
    eventName: "",
    startDate: "",
    endDate: "",
    itemsPurchased: "",
    description: "",
    name: "Aman Sharma",
    vendor: "aman",

    // base fields
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
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
    final_amount: 0,
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
    final_amount: 0,
    receipt: null,
  },
  "Book Purchases": {
    bookTitle: "",
    name: "",
    vendor: "aman",
    items: [
      {
        itemName: "",
        unitPrice: 0, // Initialize as number
        quantity: 1, // Initialize as number with a default value
        unitType: "",
      },
    ],
    description: "",
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
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
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
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
    paymentType: "cash",
    penalty: 0,
    final_amount: 0,
    receipt: null,
  },
  "Affiliation Fees": {
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
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
  },
  "LMS/ERP Subscription": {
    name: "",
    vendor: "",
    Date: "",
    description: "",
    //
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
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
    final_amount: 0,
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
    final_amount: 0,
    receipt: null,
  },
  "Social Media Ads": {
    name: "",
    vendor: "",
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
  },
  "Brochures & Pamphlets": {
    name: "",
    vendor: "",
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
  },
  "Legal and Audit Fees": {
    name: "",
    vendor: "",
    totalAmount: 750,
    tax: 75,
    discount: 25,
    penalty: 0,
    final_amount: 800,
    total_amount: 800,
    receipt: "receipt12345.pdf",
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
    final_amount: 0,
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
    final_amount: 0,
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

  "IT and Software": {
    "LMS/ERP Subscription": LMSERPSubscriptionForm,
    "Website Maintenance": WebsiteMaintenanceForm,
    "Software Licensing": SoftwareLicensingForm,
  },
  "Examination and Affiliation": {
    "Printing Exam Papers": PrintingExamPapersForm,
    "Examination Invigilator Payments": ExaminationInvigilatorForm, // Updated subcategory name for consistency
    "Affiliation Fees": AffiliationFeesForm,
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
