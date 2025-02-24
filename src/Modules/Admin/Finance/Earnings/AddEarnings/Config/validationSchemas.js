// src/Components/Admin/Finance/Earnings/Config/validationSchemas.js

import * as Yup from "yup";

export const validationSchemas = {
  "Rent Income": Yup.object({
    categoryName: Yup.string().required("Category name is required"),
    subCategory: Yup.string().required("Sub-category is required"),
    paymentType: Yup.string()
      .oneOf(["cash", "card", "online", "cheque", "other"])
      .required("Payment type is required"),
    paymentStatus: Yup.string()
      .oneOf(["paid", "unpaid", "partial", "advance"])
      .required("Payment status is required"),
    paid_amount: Yup.number()
      .min(0, "Paid amount cannot be negative")
      .required("Paid amount is required"),
    paidBy: Yup.string()
      .oneOf(["Manual", "Auto"])
      .required("Paid By is required"),
    advance_amount: Yup.number().min(0, "Advance amount cannot be negative"),
    remaining_amount: Yup.number().min(
      0,
      "Remaining amount cannot be negative"
    ),
    tax: Yup.number().min(0, "Tax cannot be negative"),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"])
      .required("Discount type is required"),
    discount: Yup.number().min(0, "Discount cannot be negative"),
    penalty: Yup.number().min(0, "Penalty cannot be negative"),
    frequencyOfPayment: Yup.string()
      .oneOf(["Monthly", "Quarterly", "Half Yearly", "Yearly", "Custom Date"])
      .required("Frequency of payment is required"),
    dateTime: Yup.date().required("Date & Time is required").nullable(),
    total_amount: Yup.number()
      .min(0, "Total amount cannot be negative")
      .required("Total amount is required"),
    final_amount: Yup.number()
      .min(0, "Final amount cannot be negative")
      .required("Final amount is required"),
    // Specific fields based on subCategory
    name: Yup.string().required("Property name is required"),
    startDate: Yup.date().required("Start date is required").nullable(),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date cannot be before start date")
      .nullable(),
    nameOfRenter: Yup.string().required("Name of renter is required"),
    receipt: Yup.mixed(),
  }),
  "Exam Center Fees": Yup.object({
    categoryName: Yup.string().required("Category name is required"),
    subCategory: Yup.string().required("Sub-category is required"),
    examName: Yup.string().required("Exam name is required"),
    startDate: Yup.date().required("Start date is required").nullable(),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date cannot be before start date")
      .nullable(),
    mobileNumber: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
    paymentType: Yup.string()
      .oneOf(["cash", "card", "online", "cheque", "other"])
      .required("Payment type is required"),
    paymentStatus: Yup.string()
      .oneOf(["paid", "unpaid", "partial", "advance"])
      .required("Payment status is required"),
    paid_amount: Yup.number()
      .min(0, "Paid amount cannot be negative")
      .required("Paid amount is required"),
    paidBy: Yup.string()
      .oneOf(["Manual", "Auto"])
      .required("Paid By is required"),
    advance_amount: Yup.number().min(0, "Advance amount cannot be negative"),
    remaining_amount: Yup.number().min(
      0,
      "Remaining amount cannot be negative"
    ),
    tax: Yup.number().min(0, "Tax cannot be negative"),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"])
      .required("Discount type is required"),
    discount: Yup.number().min(0, "Discount cannot be negative"),
    penalty: Yup.number().min(0, "Penalty cannot be negative"),
    frequencyOfPayment: Yup.string()
      .oneOf(["Monthly", "Quarterly", "Half Yearly", "Yearly", "Custom Date"])
      .required("Frequency of payment is required"),
    dateTime: Yup.date().required("Date & Time is required").nullable(),
    total_amount: Yup.number()
      .min(0, "Total amount cannot be negative")
      .required("Total amount is required"),
    final_amount: Yup.number()
      .min(0, "Final amount cannot be negative")
      .required("Final amount is required"),
    receipt: Yup.mixed(),
    // Add other field validations as necessary
  }),
  "Parking Fees": Yup.object({
    categoryName: Yup.string().required("Category name is required"),
    subCategory: Yup.string().required("Sub-category is required"),
    vehicleType: Yup.string()
      .oneOf(["car", "bike", "bicycle", "bus", "van", "other"])
      .required("Vehicle type is required"),
    name: Yup.string().required("Name is required"),
    userType: Yup.string()
      .oneOf(["staff", "student", "other"])
      .required("User type is required"),
    otherVehicleDetails: Yup.string().when("vehicleType", {
      is: "other",
      then: Yup.string().required("Other vehicle details are required"),
      otherwise: Yup.string(),
    }),
    otherUserDetails: Yup.string().when("userType", {
      is: "other",
      then: Yup.string().required("Other user details are required"),
      otherwise: Yup.string(),
    }),
    paymentType: Yup.string()
      .oneOf(["cash", "card", "online", "cheque", "other"])
      .required("Payment type is required"),
    paymentStatus: Yup.string()
      .oneOf(["paid", "unpaid", "partial", "advance"])
      .required("Payment status is required"),
    paid_amount: Yup.number()
      .min(0, "Paid amount cannot be negative")
      .required("Paid amount is required"),
    paidBy: Yup.string()
      .oneOf(["Manual", "Auto"])
      .required("Paid By is required"),
    advance_amount: Yup.number().min(0, "Advance amount cannot be negative"),
    remaining_amount: Yup.number().min(
      0,
      "Remaining amount cannot be negative"
    ),
    tax: Yup.number().min(0, "Tax cannot be negative"),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"])
      .required("Discount type is required"),
    discount: Yup.number().min(0, "Discount cannot be negative"),
    penalty: Yup.number().min(0, "Penalty cannot be negative"),
    frequencyOfPayment: Yup.string()
      .oneOf(["Monthly", "Quarterly", "Half Yearly", "Yearly", "Custom Date"])
      .required("Frequency of payment is required"),
    dateTime: Yup.date().required("Date & Time is required").nullable(),
    total_amount: Yup.number()
      .min(0, "Total amount cannot be negative")
      .required("Total amount is required"),
    final_amount: Yup.number()
      .min(0, "Final amount cannot be negative")
      .required("Final amount is required"),
    receipt: Yup.mixed(),
    // Add other field validations as necessary
  }),
  "Stationery Fees": Yup.object({
    categoryName: Yup.string().required("Category name is required"),
    subCategory: Yup.string().required("Sub-category is required"),
    stationeryItems: Yup.array()
      .of(
        Yup.object({
          itemName: Yup.string().required("Item name is required"),
          quantity: Yup.number()
            .min(1, "Quantity must be at least 1").positive()
            .required("Quantity is required"),
          unitCost: Yup.number()
            .min(0, "Unit cost cannot be negative").positive()
            .required("Unit cost is required"),
        })
      )
      .when("subCategory", {
        is: "Stationery Fees",
        then: Yup.array()
          .min(1, "At least one stationery item is required")

          .required("Stationery items are required"),
        otherwise: Yup.array().notRequired(),
      }),
    paymentType: Yup.string()
      .oneOf(["cash", "card", "online", "cheque", "other"])
      .required("Payment type is required"),
    paymentStatus: Yup.string()
      .oneOf(["paid", "unpaid", "partial", "advance"])
      .required("Payment status is required"),
    paid_amount: Yup.number()
      .min(0, "Paid amount cannot be negative")
      .required("Paid amount is required"),
    paidBy: Yup.string()
      .oneOf(["Manual", "Auto"])
      .required("Paid By is required"),
    advance_amount: Yup.number().min(0, "Advance amount cannot be negative"),
    remaining_amount: Yup.number().min(
      0,
      "Remaining amount cannot be negative"
    ),
    tax: Yup.number().min(0, "Tax cannot be negative"),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"])
      .required("Discount type is required"),
    discount: Yup.number().min(0, "Discount cannot be negative"),
    penalty: Yup.number().min(0, "Penalty cannot be negative"),
    frequencyOfPayment: Yup.string()
      .oneOf(["Monthly", "Quarterly", "Half Yearly", "Yearly", "Custom Date"])
      .required("Frequency of payment is required"),
    dateTime: Yup.date().required("Date & Time is required").nullable(),
    total_amount: Yup.number()
      .min(0, "Total amount cannot be negative")
      .required("Total amount is required"),
    final_amount: Yup.number()
      .min(0, "Final amount cannot be negative")
      .required("Final amount is required"),
    receipt: Yup.mixed(),
    description: Yup.string(),
  }),
  "Other Facility Fees": Yup.object({
    categoryName: Yup.string().required("Category name is required"),
    subCategory: Yup.string().required("Sub-category is required"),
    facilityName: Yup.string().required("Facility name is required"),
    accessDuration: Yup.string().required("Access duration is required"),
    paymentType: Yup.string()
      .oneOf(["cash", "card", "online", "cheque", "other"])
      .required("Payment type is required"),
    paymentStatus: Yup.string()
      .oneOf(["paid", "unpaid", "partial", "advance"])
      .required("Payment status is required"),
    paid_amount: Yup.number()
      .min(0, "Paid amount cannot be negative")
      .required("Paid amount is required"),
    paidBy: Yup.string()
      .oneOf(["Manual", "Auto"])
      .required("Paid By is required"),
    advance_amount: Yup.number().min(0, "Advance amount cannot be negative"),
    remaining_amount: Yup.number().min(
      0,
      "Remaining amount cannot be negative"
    ),
    tax: Yup.number().min(0, "Tax cannot be negative"),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"])
      .required("Discount type is required"),
    discount: Yup.number().min(0, "Discount cannot be negative"),
    penalty: Yup.number().min(0, "Penalty cannot be negative"),
    frequencyOfPayment: Yup.string()
      .oneOf(["Monthly", "Quarterly", "Half Yearly", "Yearly", "Custom Date"])
      .required("Frequency of payment is required"),
    dateTime: Yup.date().required("Date & Time is required").nullable(),
    total_amount: Yup.number()
      .min(0, "Total amount cannot be negative")
      .required("Total amount is required"),
    final_amount: Yup.number()
      .min(0, "Final amount cannot be negative")
      .required("Final amount is required"),
    receipt: Yup.mixed(),
    description: Yup.string(),
  }),
  "Subscription Fees": Yup.object({
    categoryName: Yup.string().required("Category name is required"),
    subCategory: Yup.string().required("Sub-category is required"),
    subscriptionName: Yup.string().required("Subscription name is required"),
    description: Yup.string(),
    paymentType: Yup.string()
      .oneOf(["cash", "card", "online", "cheque", "other"])
      .required("Payment type is required"),
    paymentStatus: Yup.string()
      .oneOf(["paid", "unpaid", "partial", "advance"])
      .required("Payment status is required"),
    paid_amount: Yup.number()
      .min(0, "Paid amount cannot be negative")
      .required("Paid amount is required"),
    paidBy: Yup.string()
      .oneOf(["Manual", "Auto"])
      .required("Paid By is required"),
    advance_amount: Yup.number().min(0, "Advance amount cannot be negative"),
    remaining_amount: Yup.number().min(
      0,
      "Remaining amount cannot be negative"
    ),
    tax: Yup.number().min(0, "Tax cannot be negative"),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"])
      .required("Discount type is required"),
    discount: Yup.number().min(0, "Discount cannot be negative"),
    penalty: Yup.number().min(0, "Penalty cannot be negative"),
    frequencyOfPayment: Yup.string()
      .oneOf(["Monthly", "Quarterly", "Half Yearly", "Yearly", "Custom Date"])
      .required("Frequency of payment is required"),
    dateTime: Yup.date().required("Date & Time is required").nullable(),
    total_amount: Yup.number()
      .min(0, "Total amount cannot be negative")
      .required("Total amount is required"),
    final_amount: Yup.number()
      .min(0, "Final amount cannot be negative")
      .required("Final amount is required"),
    receipt: Yup.mixed(),
  }),
  "Workshop/Training Fees": Yup.object({
    categoryName: Yup.string().required("Category name is required"),
    subCategory: Yup.string().required("Sub-category is required"),
    sessionTitle: Yup.string().required("Session title is required"),
    hostName: Yup.string().required("Host name is required"),
    timePeriod: Yup.string().required("Time period is required"),
    paymentType: Yup.string()
      .oneOf(["cash", "card", "online", "cheque", "other"])
      .required("Payment type is required"),
    paymentStatus: Yup.string()
      .oneOf(["paid", "unpaid", "partial", "advance"])
      .required("Payment status is required"),
    paid_amount: Yup.number()
      .min(0, "Paid amount cannot be negative")
      .required("Paid amount is required"),
    paidBy: Yup.string()
      .oneOf(["Manual", "Auto"])
      .required("Paid By is required"),
    advance_amount: Yup.number().min(0, "Advance amount cannot be negative"),
    remaining_amount: Yup.number().min(
      0,
      "Remaining amount cannot be negative"
    ),
    tax: Yup.number().min(0, "Tax cannot be negative"),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"])
      .required("Discount type is required"),
    discount: Yup.number().min(0, "Discount cannot be negative"),
    penalty: Yup.number().min(0, "Penalty cannot be negative"),
    frequencyOfPayment: Yup.string()
      .oneOf(["Monthly", "Quarterly", "Half Yearly", "Yearly", "Custom Date"])
      .required("Frequency of payment is required"),
    dateTime: Yup.date().required("Date & Time is required").nullable(),
    total_amount: Yup.number()
      .min(0, "Total amount cannot be negative")
      .required("Total amount is required"),
    final_amount: Yup.number()
      .min(0, "Final amount cannot be negative")
      .required("Final amount is required"),
    receipt: Yup.mixed(),
  }),
  "Canteen Profit": Yup.object({
    categoryName: Yup.string().required("Category name is required"),
    subCategory: Yup.string().required("Sub-category is required"),
    periodOfEarnings: Yup.string()
      .oneOf(["Monthly", "Quarterly", "Half-yearly", "Yearly"])
      .required("Period of earnings is required"),
    description: Yup.string(),
    paymentType: Yup.string()
      .oneOf(["cash", "card", "online", "cheque", "other"])
      .required("Payment type is required"),
    paymentStatus: Yup.string()
      .oneOf(["paid", "unpaid", "partial", "advance"])
      .required("Payment status is required"),
    paid_amount: Yup.number()
      .min(0, "Paid amount cannot be negative")
      .required("Paid amount is required"),
    paidBy: Yup.string()
      .oneOf(["Manual", "Auto"])
      .required("Paid By is required"),
    advance_amount: Yup.number().min(0, "Advance amount cannot be negative"),
    remaining_amount: Yup.number().min(
      0,
      "Remaining amount cannot be negative"
    ),
    tax: Yup.number().min(0, "Tax cannot be negative"),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"])
      .required("Discount type is required"),
    discount: Yup.number().min(0, "Discount cannot be negative"),
    penalty: Yup.number().min(0, "Penalty cannot be negative"),
    frequencyOfPayment: Yup.string()
      .oneOf(["Monthly", "Quarterly", "Half Yearly", "Yearly", "Custom Date"])
      .required("Frequency of payment is required"),
    dateTime: Yup.date().required("Date & Time is required").nullable(),
    total_amount: Yup.number()
      .min(0, "Total amount cannot be negative")
      .required("Total amount is required"),
    final_amount: Yup.number()
      .min(0, "Final amount cannot be negative")
      .required("Final amount is required"),
    receipt: Yup.mixed(),
  }),
  Donations: Yup.object({
    categoryName: Yup.string().required("Category name is required"),
    subCategory: Yup.string()
      .oneOf(["Donations", "Fundraising/Sponsorships", "Other"])
      .required("Sub-category is required"),
    name: Yup.string().required("Donor name is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .nullable(),
    address: Yup.string().nullable(),
    paymentType: Yup.string()
      .oneOf(["cash", "card", "online", "cheque", "other"])
      .required("Payment type is required"),
    paymentStatus: Yup.string()
      .oneOf(["paid", "unpaid", "partial", "advance"])
      .required("Payment status is required"),
    paid_amount: Yup.number()
      .min(0, "Paid amount cannot be negative")
      .required("Paid amount is required"),
    paidBy: Yup.string()
      .oneOf(["Manual", "Auto"])
      .required("Paid By is required"),
    advance_amount: Yup.number().min(0, "Advance amount cannot be negative"),
    remaining_amount: Yup.number().min(
      0,
      "Remaining amount cannot be negative"
    ),
    tax: Yup.number().min(0, "Tax cannot be negative"),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"])
      .required("Discount type is required"),
    discount: Yup.number().min(0, "Discount cannot be negative"),
    penalty: Yup.number().min(0, "Penalty cannot be negative"),
    frequencyOfPayment: Yup.string()
      .oneOf(["Monthly", "Quarterly", "Half Yearly", "Yearly", "Custom Date"])
      .required("Frequency of payment is required"),
    dateTime: Yup.date().required("Date & Time is required").nullable(),
    total_amount: Yup.number()
      .min(0, "Total amount cannot be negative")
      .required("Total amount is required"),
    final_amount: Yup.number()
      .min(0, "Final amount cannot be negative")
      .required("Final amount is required"),
    receipt: Yup.mixed(),
    description: Yup.string(),
  }),

  "Fundraising/Sponsorships": Yup.object({
    categoryName: Yup.string().required("Category name is required"),
    subCategory: Yup.string()
      .oneOf(["Donations", "Fundraising/Sponsorships", "Other"])
      .required("Sub-category is required"),
    companyName: Yup.string().required("Company/Sponsor name is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .nullable(),
    address: Yup.string().nullable(),
    paymentType: Yup.string()
      .oneOf(["cash", "card", "online", "cheque", "other"])
      .required("Payment type is required"),
    paymentStatus: Yup.string()
      .oneOf(["paid", "unpaid", "partial", "advance"])
      .required("Payment status is required"),
    paid_amount: Yup.number()
      .min(0, "Paid amount cannot be negative")
      .required("Paid amount is required"),
    paidBy: Yup.string()
      .oneOf(["Manual", "Auto"])
      .required("Paid By is required"),
    advance_amount: Yup.number().min(0, "Advance amount cannot be negative"),
    remaining_amount: Yup.number().min(
      0,
      "Remaining amount cannot be negative"
    ),
    tax: Yup.number().min(0, "Tax cannot be negative"),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"])
      .required("Discount type is required"),
    discount: Yup.number().min(0, "Discount cannot be negative"),
    penalty: Yup.number().min(0, "Penalty cannot be negative"),
    frequencyOfPayment: Yup.string()
      .oneOf(["Monthly", "Quarterly", "Half Yearly", "Yearly", "Custom Date"])
      .required("Frequency of payment is required"),
    dateTime: Yup.date().required("Date & Time is required").nullable(),
    total_amount: Yup.number()
      .min(0, "Total amount cannot be negative")
      .required("Total amount is required"),
    final_amount: Yup.number()
      .min(0, "Final amount cannot be negative")
      .required("Final amount is required"),
    receipt: Yup.mixed(),
    description: Yup.string(),
  }),
  // Financial Investments SubCategories
  Investments: Yup.object({
    categoryName: Yup.string().required("Category name is required"),
    subCategory: Yup.string()
      .oneOf(["Investments", "Other"])
      .required("Sub-category is required"),
    name: Yup.string().required("Investment name is required"),
    profitOrLoss: Yup.string()
      .oneOf(["Profit", "Loss", "Break-even"])
      .required("Profit/Loss is required"),
    fromDate: Yup.date()
      .required("Start Date is required")
      .typeError("Invalid date format for Start Date"),
    toDate: Yup.date()
      .required("End Date is required")
      .typeError("Invalid date format for End Date")
      .min(Yup.ref("fromDate"), "End Date cannot be before Start Date"),
    investmentAmount: Yup.number()
      .typeError("Investment Amount must be a number")
      .positive("Investment Amount must be greater than zero")
      .required("Investment Amount is required"),
    returnAmount: Yup.number()
      .typeError("Return Amount must be a number")
      .positive("Return Amount must be greater than zero")
      .required("Return Amount is required"),
    paymentType: Yup.string()
      .oneOf(["cash", "card", "online", "cheque", "other"])
      .required("Payment type is required"),
    paymentStatus: Yup.string()
      .oneOf(["paid", "unpaid", "partial", "advance"])
      .required("Payment status is required"),
    paid_amount: Yup.number()
      .min(0, "Paid amount cannot be negative")
      .required("Paid amount is required"),
    paidBy: Yup.string()
      .oneOf(["Manual", "Auto"])
      .required("Paid By is required"),
    advance_amount: Yup.number().min(0, "Advance amount cannot be negative"),
    remaining_amount: Yup.number().min(
      0,
      "Remaining amount cannot be negative"
    ),
    tax: Yup.number().min(0, "Tax cannot be negative"),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"])
      .required("Discount type is required"),
    discount: Yup.number().min(0, "Discount cannot be negative"),
    penalty: Yup.number().min(0, "Penalty cannot be negative"),
    frequencyOfPayment: Yup.string()
      .oneOf(["Monthly", "Quarterly", "Half Yearly", "Yearly", "Custom Date"])
      .required("Frequency of payment is required"),
    dateTime: Yup.date()
      .required("Date & Time is required")
      .typeError("Invalid date format for Date & Time"),
    total_amount: Yup.number()
      .min(0, "Total amount cannot be negative")
      .required("Total amount is required"),
    final_amount: Yup.number()
      .min(0, "Final amount cannot be negative")
      .required("Final amount is required"),
    receipt: Yup.mixed(),
    description: Yup.string(),
  }),

  // Define validation schemas for other subCategories similarly
};
