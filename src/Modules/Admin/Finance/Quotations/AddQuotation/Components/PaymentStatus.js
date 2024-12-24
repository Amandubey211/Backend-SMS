// src/Components/Admin/Finance/Earnings/EarningsForm/PaymentStatus.jsx

import React, { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import FormSection from "./FormSection";

const paymentStatusFields = [
  {
    name: "paymentStatus",
    label: "Payment Status",
    type: "select",
    options: ["paid", "unpaid", "partial", "advance"],
  },
  {
    name: "paid_amount", // Changed to snake_case
    label: "Paid Amount (QR)",
    type: "number",
    placeholder: "Enter paid amount",
    min: 0,
  },
  {
    name: "paid_by", // Changed to snake_case
    label: "Paid By",
    type: "select",
    options: ["Manual", "Auto"],
  },
  {
    name: "payment_type", // Changed to snake_case
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
    readOnly: true, // Make it read-only as it's calculated
  },
  {
    name: "receipt",
    label: "Add Receipt/Document",
    type: "file",
  },
];

const PaymentStatus = () => {
  const { setFieldValue, values } = useFormikContext();
  const [conditionalFields, setConditionalFields] = useState([]);

  // Determine conditional fields based on paymentType
  useEffect(() => {
    const newFields = [];

    if (values.payment_type === "cheque") {
      newFields.push({
        name: "chequeNumber",
        label: "Cheque Number",
        type: "text",
        placeholder: "Enter cheque number",
      });
    }

    if (values.payment_type === "online") {
      newFields.push({
        name: "transactionId",
        label: "Transaction ID",
        type: "text",
        placeholder: "Enter transaction ID",
      });
    }

    setConditionalFields(newFields);
  }, [values.payment_type]);

  // Combine static and conditional fields
  const combinedFields = [...paymentStatusFields, ...conditionalFields];

  // Calculate remaining_amount whenever final_amount or paid_amount changes
  useEffect(() => {
    const finalAmount = Number(values.final_amount) || 0;
    const paidAmount = Number(values.paid_amount) || 0;

    const calculatedRemainingAmount = finalAmount - paidAmount;

    // Avoid setting the field if the value hasn't changed
    if (values.remaining_amount !== calculatedRemainingAmount) {
      setFieldValue("remaining_amount", calculatedRemainingAmount);
    }
  }, [
    values.final_amount,
    values.paid_amount,
    setFieldValue,
    values.remaining_amount,
  ]);

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
