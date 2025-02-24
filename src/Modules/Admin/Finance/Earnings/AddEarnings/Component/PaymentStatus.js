// src/Components/Admin/Finance/Earnings/EarningsForm/PaymentStatus.jsx

import React, { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection";

const paymentStatusFields = [
  {
    name: "paymentStatus",
    label: "Payment Status",
    type: "select",
    options: ["paid", "unpaid", "partial", "advance"],
  },
  {
    name: "paid_amount", // Using snake_case for consistency
    label: "Paid Amount (QR)",
    type: "number",
    placeholder: "Enter paid amount",
    min: 0,
  },
  {
    name: "paymentType", // Using snake_case for consistency
    label: "Payment Type",
    type: "select",
    options: ["cash", "card", "online", "cheque", "other"],
  },
  {
    name: "advance_amount",
    label: "Advance Amount (QR)",
    type: "number",
    placeholder: "Enter advance amount",
    min: 0,
  },
  {
    name: "remaining_amount",
    label: "Remaining Amount (QR)",
    type: "number",
    placeholder: "Enter remaining amount",
    min: 0,
    readOnly: true, // Calculated field
  },
  {
    type: "array",
    label: "Documents",
    name: "document",
    fields: [{ type: "file", label: "Document", name: "document" }],
    emptyItem: "",
  },
];

const PaymentStatus = () => {
  const { setFieldValue, values } = useFormikContext();
  const [conditionalFields, setConditionalFields] = useState([]);

  // Update conditional fields based on payment type
  useEffect(() => {
    const newFields = [];

    if (values.paymentType === "cheque") {
      newFields.push({
        name: "chequeNumber",
        label: "Cheque Number",
        type: "text",
        placeholder: "Enter cheque number",
      });
    }

    if (values.paymentType === "online") {
      newFields.push({
        name: "onlineTransactionId",
        label: "Transaction ID",
        type: "text",
        placeholder: "Enter transaction ID",
      });
    }

    setConditionalFields(newFields);
  }, [values.paymentType]);

  // Combine static and conditional fields
  const combinedFields = [...paymentStatusFields, ...conditionalFields];

  // Calculate remaining_amount and advance_amount consistently
  useEffect(() => {
    const finalAmount = Number(values.final_amount) || 0;
    const paidAmount = Number(values.paid_amount) || 0;

    // Calculate remaining and advance amounts
    const remainingAmount = Math.max(finalAmount - paidAmount, 0);
    const advanceAmount = Math.max(paidAmount - finalAmount, 0);

    // Update formik state
    setFieldValue("remaining_amount", remainingAmount);
    setFieldValue("advance_amount", advanceAmount);
  }, [values.final_amount, values.paid_amount, setFieldValue]);

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Payment Status
      </h2>

      <FormSection
        title=""
        fields={combinedFields}
        setFieldValue={setFieldValue}
        values={values}
      />
    </div>
  );
};

export default PaymentStatus;
