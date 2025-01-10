// import * as Yup from "yup";

// // Helper function to conditionally require fields based on payment_type
// const paymentTypeConditions = {
//   card: {
//     cardTransactionId: Yup.string().required("Card Transaction ID is required"),
//   },
//   online: {
//     onlineTransactionId: Yup.string().required(
//       "Online Transaction ID is required"
//     ),
//   },
//   cheque: {
//     chequeNumber: Yup.string().required("Cheque Number is required"),
//   },
// };

// // Base schema for common fields across all forms
// const baseSchema = Yup.object().shape({
//   // Base fields
//   total_amount: Yup.number()
//     .typeError("Total Amount must be a number")
//     .required("Total Amount is required")
//     .min(0, "Total Amount cannot be negative"),
//   tax: Yup.number()
//     .typeError("Tax must be a number")
//     .required("Tax is required")
//     .min(0, "Tax cannot be negative"),
//   discount: Yup.number()
//     .typeError("Discount must be a number")
//     .required("Discount is required")
//     .min(0, "Discount cannot be negative"),
//   penalty: Yup.number()
//     .typeError("Penalty must be a number")
//     .required("Penalty is required")
//     .min(0, "Penalty cannot be negative"),
//   final_amount: Yup.number()
//     .typeError("Final Amount must be a number")
//     .required("Final Amount is required")
//     .min(0, "Final Amount cannot be negative"),
//   paid_amount: Yup.number()
//     .typeError("Paid Amount must be a number")
//     .required("Paid Amount is required")
//     .min(0, "Paid Amount cannot be negative"),
//   remaining_amount: Yup.number()
//     .typeError("Remaining Amount must be a number")
//     .required("Remaining Amount is required")
//     .min(0, "Remaining Amount cannot be negative"),
//   receipt: Yup.string().required("Receipt is required"),
//   paymentStatus: Yup.string()
//     .oneOf(["paid", "unpaid", "partial", "advance"], "Invalid Payment Status")
//     .required("Payment Status is required"),
//   payment_type: Yup.string()
//     .oneOf(
//       ["cash", "card", "online", "cheque", "other"],
//       "Invalid Payment Type"
//     )
//     .required("Payment Type is required"),
// });

// // Schema for conditional fields based on payment_type
// const paymentTypeSchema = Yup.object()
//   .shape({
//     payment_type: Yup.string().required("Payment Type is required"),
//   })
//   .concat(
//     Yup.lazy((values) => {
//       if (values.payment_type === "card") {
//         return Yup.object().shape({
//           cardTransactionId: Yup.string().required(
//             "Card Transaction ID is required"
//           ),
//         });
//       } else if (values.payment_type === "online") {
//         return Yup.object().shape({
//           onlineTransactionId: Yup.string().required(
//             "Online Transaction ID is required"
//           ),
//         });
//       } else if (values.payment_type === "cheque") {
//         return Yup.object().shape({
//           chequeNumber: Yup.string().required("Cheque Number is required"),
//         });
//       }
//       return Yup.object(); // No additional fields
//     })
//   );

// // Validation schemas for each subCategory
// export const validationSchemas = {
//   // Teaching Staffs
//   "Teaching Staffs": Yup.object().shape({
//     // Category-specific fields
//     staffType: Yup.string().required("Staff Type is required"),
//     staffId: Yup.string().required("Staff ID is required"),

//     // Base fields
//     ...baseSchema.fields,

//     // Additional fields
//     recurringExpense: Yup.object().shape({
//       isRecurring: Yup.boolean().required("Is Recurring is required"),
//       frequency: Yup.string()
//         .oneOf(["daily", "weekly", "monthly", "yearly"], "Invalid Frequency")
//         .required("Frequency is required"),
//       nextDueDate: Yup.date()
//         .nullable()
//         .when("isRecurring", {
//           is: true,
//           then: Yup.date().required(
//             "Next Due Date is required for recurring expenses"
//           ),
//           otherwise: Yup.date().nullable(),
//         }),
//     }),
//     allowance: Yup.object().shape({
//       // Define allowance fields if any
//       // Example:
//       // housing: Yup.number().min(0, "Housing allowance cannot be negative").required("Housing allowance is required"),
//     }),
//     deduction: Yup.object().shape({
//       // Define deduction fields if any
//       // Example:
//       // tax: Yup.number().min(0, "Tax deduction cannot be negative").required("Tax deduction is required"),
//     }),
//     totalAllowance: Yup.number()
//       .typeError("Total Allowance must be a number")
//       .required("Total Allowance is required")
//       .min(0, "Total Allowance cannot be negative"),
//     totalDeduction: Yup.number()
//       .typeError("Total Deduction must be a number")
//       .required("Total Deduction is required")
//       .min(0, "Total Deduction cannot be negative"),
//     bonus: Yup.number()
//       .typeError("Bonus must be a number")
//       .required("Bonus is required")
//       .min(0, "Bonus cannot be negative"),
//   }),

//   // Non-Teaching Staffs
//   "Non-Teaching Staffs": Yup.object().shape({
//     // Category-specific fields
//     staffType: Yup.string().required("Staff Type is required"),
//     staffId: Yup.string().required("Staff ID is required"),

//     // Base fields
//     ...baseSchema.fields,

//     // Additional fields
//     recurringExpense: Yup.object().shape({
//       isRecurring: Yup.boolean().required("Is Recurring is required"),
//       frequency: Yup.string()
//         .oneOf(["daily", "weekly", "monthly", "yearly"], "Invalid Frequency")
//         .required("Frequency is required"),
//       nextDueDate: Yup.date()
//         .nullable()
//         .when("isRecurring", {
//           is: true,
//           then: Yup.date().required(
//             "Next Due Date is required for recurring expenses"
//           ),
//           otherwise: Yup.date().nullable(),
//         }),
//     }),
//     allowance: Yup.object().shape({
//       // Define allowance fields if any
//     }),
//     deduction: Yup.object().shape({
//       // Define deduction fields if any
//     }),
//     totalAllowance: Yup.number()
//       .typeError("Total Allowance must be a number")
//       .required("Total Allowance is required")
//       .min(0, "Total Allowance cannot be negative"),
//     totalDeduction: Yup.number()
//       .typeError("Total Deduction must be a number")
//       .required("Total Deduction is required")
//       .min(0, "Total Deduction cannot be negative"),
//     bonus: Yup.number()
//       .typeError("Bonus must be a number")
//       .required("Bonus is required")
//       .min(0, "Bonus cannot be negative"),
//   }),

//   // Utilities
//   Utilities: Yup.object().shape({
//     // Category-specific fields
//     utilityType: Yup.string()
//       .oneOf(
//         ["electricity", "water", "internet", "gas", "other"],
//         "Invalid Utility Type"
//       )
//       .required("Utility Type is required"),
//     name: Yup.string().required("Name is required"),
//     vendor: Yup.string().required("Vendor is required"),
//     description: Yup.string().required("Description is required"),
//     expenseSubCategory: Yup.string().required(
//       "Expense SubCategory is required"
//     ),

//     // Base fields
//     ...baseSchema.fields,
//   }),

//   // Maintenance
//   Maintenance: Yup.object().shape({
//     // Category-specific fields
//     name: Yup.string().required("Name is required"),
//     vendor: Yup.string().required("Vendor is required"),
//     expenseSubCategory: Yup.string().required(
//       "Expense SubCategory is required"
//     ),
//     maintenanceCategory: Yup.string().required(
//       "Maintenance Category is required"
//     ),
//     description: Yup.string().required("Description is required"),

//     // Base fields
//     ...baseSchema.fields,
//   }),

//   // Classroom & Office Purpose
//   "Classroom & Office Purpose": Yup.object().shape({
//     // Category-specific fields
//     itemsPurchased: Yup.string().required("Items Purchased is required"),
//     description: Yup.string().required("Description is required"),
//     name: Yup.string().required("Name is required"),
//     vendor: Yup.string().required("Vendor is required"),
//     purchasedDate: Yup.date()
//       .typeError("Purchased Date must be a valid date")
//       .required("Purchased Date is required"),
//     items: Yup.array()
//       .of(
//         Yup.object().shape({
//           itemName: Yup.string().required("Item Name is required"),
//           unitPrice: Yup.number()
//             .typeError("Unit Price must be a number")
//             .required("Unit Price is required")
//             .min(0, "Unit Price cannot be negative"),
//           quantity: Yup.number()
//             .typeError("Quantity must be a number")
//             .required("Quantity is required")
//             .min(1, "Quantity must be at least 1"),
//           unitType: Yup.string().required("Unit Type is required"),
//         })
//       )
//       .min(1, "At least one item must be added")
//       .required("Items are required"),

//     // Base fields
//     ...baseSchema.fields,
//   }),

//   // Decorations
//   Decorations: Yup.object().shape({
//     // Category-specific fields
//     eventName: Yup.string().required("Event Name is required"),
//     startDate: Yup.date()
//       .typeError("Start Date must be a valid date")
//       .required("Start Date is required"),
//     endDate: Yup.date()
//       .typeError("End Date must be a valid date")
//       .required("End Date is required")
//       .min(Yup.ref("startDate"), "End Date cannot be before Start Date"),
//     itemsPurchased: Yup.string().required("Items Purchased is required"),
//     description: Yup.string().required("Description is required"),
//     name: Yup.string().required("Name is required"),
//     vendor: Yup.string().required("Vendor is required"),

//     // Base fields
//     ...baseSchema.fields,
//   }),

//   // Book Purchases
//   "Book Purchases": Yup.object().shape({
//     // Category-specific fields
//     bookTitle: Yup.string().required("Book Title is required"),
//     name: Yup.string().required("Name is required"),
//     vendor: Yup.string().required("Vendor is required"),
//     description: Yup.string().required("Description is required"),
//     items: Yup.array()
//       .of(
//         Yup.object().shape({
//           itemName: Yup.string().required("Item Name is required"),
//           unitPrice: Yup.number()
//             .typeError("Unit Price must be a number")
//             .required("Unit Price is required")
//             .min(0, "Unit Price cannot be negative"),
//           quantity: Yup.number()
//             .typeError("Quantity must be a number")
//             .required("Quantity is required")
//             .min(1, "Quantity must be at least 1"),
//           unitType: Yup.string().required("Unit Type is required"),
//         })
//       )
//       .min(1, "At least one item must be added")
//       .required("Items are required"),

//     // Base fields
//     ...baseSchema.fields,
//   }),

//   // Printing Exam Papers
//   "Printing Exam Papers": Yup.object().shape({
//     // Category-specific fields
//     name: Yup.string().required("Name is required"),
//     vendor: Yup.string().required("Vendor is required"),
//     description: Yup.string().required("Description is required"),
//     vendorName: Yup.string().required("Vendor Name is required"),
//     examRelatedCosts: Yup.array()
//       .of(
//         Yup.object().shape({
//           itemName: Yup.string().required("Item Name is required"),
//           cost: Yup.number()
//             .typeError("Cost must be a number")
//             .required("Cost is required")
//             .min(0, "Cost cannot be negative"),
//         })
//       )
//       .min(1, "At least one exam-related cost must be added")
//       .required("Exam Related Costs are required"),

//     // Base fields
//     ...baseSchema.fields,
//   }),

//   // LMS/ERP Subscription
//   "LMS/ERP Subscription": Yup.object().shape({
//     // Category-specific fields
//     name: Yup.string().required("Name is required"),
//     vendor: Yup.string().required("Vendor is required"),
//     Date: Yup.date()
//       .typeError("Date must be a valid date")
//       .required("Date is required"),
//     description: Yup.string().required("Description is required"),

//     // Base fields
//     ...baseSchema.fields,
//   }),

//   // Legal and Audit Fees
//   "Legal and Audit Fees": Yup.object().shape({
//     // Category-specific fields
//     name: Yup.string().required("Name is required"),
//     vendor: Yup.string().required("Vendor is required"),

//     // Base fields
//     ...baseSchema.fields,
//   }),
// };
