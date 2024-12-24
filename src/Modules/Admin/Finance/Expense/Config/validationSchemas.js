// src/Components/Admin/Finance/Expenses/Config/validationSchemas.js

import * as Yup from "yup";

export const validationSchemas = {
  Utilities: Yup.object({
    utilityType: Yup.string().required("Utility Type is required"),
    amount: Yup.number()
      .min(0, "Amount must be positive")
      .required("Amount is required"),
    paymentDate: Yup.date().required("Payment Date is required"),
    vendor: Yup.string().required("Vendor is required"),
    paymentMethod: Yup.string()
      .oneOf(["cash", "bank"])
      .required("Payment Method is required"),
    description: Yup.string().max(
      500,
      "Description can be at most 500 characters"
    ),
  }),
  Supplies: Yup.object({
    itemName: Yup.string().required("Item Name is required"),
    quantity: Yup.number()
      .min(1, "Quantity must be at least 1")
      .required("Quantity is required"),
    unitCost: Yup.number()
      .min(0, "Unit Cost must be positive")
      .required("Unit Cost is required"),
    totalCost: Yup.number()
      .min(0, "Total Cost must be positive")
      .required("Total Cost is required"),
    vendor: Yup.string().required("Vendor is required"),
    paymentMethod: Yup.string()
      .oneOf(["cash", "bank"])
      .required("Payment Method is required"),
    description: Yup.string().max(
      500,
      "Description can be at most 500 characters"
    ),
  }),
  // Define schemas for other subCategories similarly
  // Example for Rent
  Rent: Yup.object({
    propertyAddress: Yup.string().required("Property Address is required"),
    amount: Yup.number()
      .min(0, "Amount must be positive")
      .required("Amount is required"),
    paymentDate: Yup.date().required("Payment Date is required"),
    landlord: Yup.string().required("Landlord is required"),
    paymentMethod: Yup.string()
      .oneOf(["cash", "bank"])
      .required("Payment Method is required"),
    description: Yup.string().max(
      500,
      "Description can be at most 500 characters"
    ),
  }),
  // Continue for all other subCategories...
};
