// src/Components/Admin/Finance/Earnings/EarningsForm/PaymentStatus.jsx

import React from "react";
import { useFormikContext } from "formik";
import FormSection from "./FormSection"; // Adjust the path as necessary

const PaymentStatus = () => {
  const { setFieldValue, values } = useFormikContext();

  // Define static fields
  const paymentStatusFields = [
    {
      name: "paymentStatus",
      label: "Payment Status",
      type: "select",
      options: ["paid", "unpaid", "partial", "advance"],
    },
    {
      name: "paidAmount",
      label: "Paid Amount (QR)",
      type: "number",
      placeholder: "Enter paid amount",
      min: 0,
    },
    {
      name: "paidBy",
      label: "Paid By",
      type: "select",
      options: ["Manual", "Auto"],
    },
    {
      name: "paymentType",
      label: "Payment Type",
      type: "select",
      options: ["cash", "card", "online", "cheque", "other"],
    },
    {
      name: "advanceAmount",
      label: "Advance Amount (QR)",
      type: "number",
      placeholder: "Enter advance amount",
      min: 0,
    },
    {
      name: "remainingAmount",
      label: "Remaining Amount (QR)",
      type: "number",
      placeholder: "Enter remaining amount",
      min: 0,
    },
    {
      name: "receipt",
      label: "Add Receipt/Document",
      type: "file",
    },
  ];

  // Define conditional fields based on paymentType
  const conditionalFields = [];

  if (values?.paymentType === "Cheque") {
    conditionalFields.push({
      name: "chequeNumber",
      label: "Cheque Number",
      type: "text",
      placeholder: "Enter cheque number",
    });
  }

  if (values?.paymentType === "Online") {
    conditionalFields.push({
      name: "transactionId",
      label: "Transaction ID",
      type: "text",
      placeholder: "Enter transaction ID",
    });
  }

  // Combine static and conditional fields, ensuring conditional fields are after paymentType
  const combinedFields = [...paymentStatusFields];

  // Find the index of paymentType field
  const paymentTypeIndex = combinedFields.findIndex(
    (field) => field.name === "paymentType"
  );

  // Insert conditional fields right after paymentType
  if (paymentTypeIndex !== -1 && conditionalFields.length > 0) {
    combinedFields.splice(paymentTypeIndex + 1, 0, ...conditionalFields);
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Payment Status
      </h2>

      {/* Render combined fields in a single FormSection */}
      <FormSection
        title="" // No title as it's already provided above
        fields={combinedFields}
        setFieldValue={setFieldValue}
        values={values}
      />
    </div>
  );
};

export default PaymentStatus;
