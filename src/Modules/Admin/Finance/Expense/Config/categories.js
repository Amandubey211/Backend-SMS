// src/Components/Admin/Finance/Expenses/Config/categories.js

export const categories = [
  "Salaries and Wages",
  "Utilities and Maintenance",
  "Supplies",
  "Event and Activity Costs",
  "Library and Academic Resources",
  "IT and Software",
  "Examination and Affiliation",
  "Marketing and Advertising",
  "Miscellaneous",
  //"Others",
];

export const subCategories = {
  "Salaries and Wages": [
    "Teaching Staffs",
    "Non-Teaching Staffs",
    //"Others",
  ],
  "Utilities and Maintenance": [
    "Utilities",
    "Building Maintenance",
    "Furniture Maintenance",
    "IT Equipment Maintenance",
    "Fuel Costs",
    //"Others",
  ],
  Supplies: [
    "Classroom & Office Purpose", // Updated from "Stationery Supplies" for clarity
    // "Canteen Supplies",
    //"Others",
  ],
  "Event and Activity Costs": [
    "Decorations",
    // "Equipment Rentals",
    // "Prizes and Gifts",
    //"Others",
  ],
  "Library and Academic Resources": [
    "Book Purchases",
    // "Digital Resources",
    //"Others",
  ],
  "IT and Software": [
    "LMS/ERP Subscription",
    // "Website Maintenance",
    // "Software Licensing",
    //"Others",
  ],
  "Examination and Affiliation": [
    "Printing Exam Papers",
    // "Examination Invigilator Payments", // Updated from "Invigilation Fees" for consistency
    "Affiliation Fees",
    //"Others",
  ],
  "Marketing and Advertising": [
    "Social Media Ads",
    "Brochures & Pamphlets",
    //"Others",
  ],
  Miscellaneous: [
    "Legal and Audit Fees",
    // "Insurance Premium",
    // "Canteen Equipment Maintenance",
    //"Others",
  ],
  // "Others": ["Custom Expenses"], // Kept commented out as per categories array
};
