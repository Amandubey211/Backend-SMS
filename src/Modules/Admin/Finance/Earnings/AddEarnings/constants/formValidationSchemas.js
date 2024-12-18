// formValidationSchemas.js

import * as Yup from "yup";

export const validationSchemaMap = {
  "Student-Based Revenue": Yup.object({
    studentName: Yup.string().required("Student Name is required"),
    class: Yup.string().required("Class is required"),
    section: Yup.string().required("Section is required"),
    frequencyOfPayment: Yup.string().required("Frequency of Payment is required"),
    dateTime: Yup.date().required("Date & Time is required"),
    discount: Yup.number()
      .min(0, "Discount cannot be negative")
      .required("Discount is required"),
    penalty: Yup.number()
      .min(0, "Penalty cannot be negative")
      .required("Penalty is required"),
    totalAmount: Yup.number()
      .min(0, "Total Amount cannot be negative")
      .required("Total Amount is required"),
    finalAmount: Yup.number()
      .min(0, "Final Amount cannot be negative")
      .required("Final Amount is required"),
    paymentStatus: Yup.string().required("Payment Status is required"),
    paidAmount: Yup.number()
      .min(0, "Paid Amount cannot be negative")
      .required("Paid Amount is required"),
    paidBy: Yup.string().required("Paid By is required"),
    paymentType: Yup.string().required("Payment Type is required"),
    chequeNumber: Yup.string().when("paymentType", {
      is: "Cheque",
      then: Yup.string().required("Cheque Number is required"),
      otherwise: Yup.string(),
    }),
    transactionId: Yup.string().when("paymentType", {
      is: "Online",
      then: Yup.string().required("Transaction ID is required"),
      otherwise: Yup.string(),
    }),
    advanceAmount: Yup.number()
      .min(0, "Advance Amount cannot be negative")
      .required("Advance Amount is required"),
    remainingAmount: Yup.number()
      .min(0, "Remaining Amount cannot be negative")
      .required("Remaining Amount is required"),
    receipt: Yup.mixed().nullable(),
    description: Yup.string(),
  }),
  Donations: Yup.object({
    name: Yup.string().required("Name is required"),
    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits"),
    address: Yup.string().required("Address is required"),
    frequencyOfPayment: Yup.string().required("Frequency of Payment is required"),
    dateTime: Yup.date().required("Date & Time is required"),
    discount: Yup.number()
      .min(0, "Discount cannot be negative")
      .required("Discount is required"),
    penalty: Yup.number()
      .min(0, "Penalty cannot be negative")
      .required("Penalty is required"),
    totalAmount: Yup.number()
      .min(0, "Total Amount cannot be negative")
      .required("Total Amount is required"),
    finalAmount: Yup.number()
      .min(0, "Final Amount cannot be negative")
      .required("Final Amount is required"),
    paymentStatus: Yup.string().required("Payment Status is required"),
    paidAmount: Yup.number()
      .min(0, "Paid Amount cannot be negative")
      .required("Paid Amount is required"),
    paidBy: Yup.string().required("Paid By is required"),
    paymentType: Yup.string().required("Payment Type is required"),
    chequeNumber: Yup.string().when("paymentType", {
      is: "Cheque",
      then: Yup.string().required("Cheque Number is required"),
      otherwise: Yup.string(),
    }),
    transactionId: Yup.string().when("paymentType", {
      is: "Online",
      then: Yup.string().required("Transaction ID is required"),
      otherwise: Yup.string(),
    }),
    advanceAmount: Yup.number()
      .min(0, "Advance Amount cannot be negative")
      .required("Advance Amount is required"),
    remainingAmount: Yup.number()
      .min(0, "Remaining Amount cannot be negative")
      .required("Remaining Amount is required"),
    receipt: Yup.mixed().nullable(),
    description: Yup.string(),
  }),
  // Add validation schemas for other subcategories similarly
  // Example:
  "Exam Fees": Yup.object({
    examName: Yup.string().required("Exam Name is required"),
    userOrganisationName: Yup.string().required("User/Organisation Name is required"),
    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits"),
    timePeriod: Yup.string().required("Time Period is required"),
    frequencyOfPayment: Yup.string().required("Frequency of Payment is required"),
    dateTime: Yup.date().required("Date & Time is required"),
    discount: Yup.number()
      .min(0, "Discount cannot be negative")
      .required("Discount is required"),
    penalty: Yup.number()
      .min(0, "Penalty cannot be negative")
      .required("Penalty is required"),
    totalAmount: Yup.number()
      .min(0, "Total Amount cannot be negative")
      .required("Total Amount is required"),
    finalAmount: Yup.number()
      .min(0, "Final Amount cannot be negative")
      .required("Final Amount is required"),
    paymentStatus: Yup.string().required("Payment Status is required"),
    paidAmount: Yup.number()
      .min(0, "Paid Amount cannot be negative")
      .required("Paid Amount is required"),
    paidBy: Yup.string().required("Paid By is required"),
    paymentType: Yup.string().required("Payment Type is required"),
    chequeNumber: Yup.string().when("paymentType", {
      is: "Cheque",
      then: Yup.string().required("Cheque Number is required"),
      otherwise: Yup.string(),
    }),
    transactionId: Yup.string().when("paymentType", {
      is: "Online",
      then: Yup.string().required("Transaction ID is required"),
      otherwise: Yup.string(),
    }),
    advanceAmount: Yup.number()
      .min(0, "Advance Amount cannot be negative")
      .required("Advance Amount is required"),
    remainingAmount: Yup.number()
      .min(0, "Remaining Amount cannot be negative")
      .required("Remaining Amount is required"),
    receipt: Yup.mixed().nullable(),
    description: Yup.string(),
  }),
  // Continue for all other subcategories...
};
