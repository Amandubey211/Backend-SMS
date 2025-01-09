// src/Components/Admin/Finance/Earnings/Component/TransactionDetails.jsx

import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import { useSelector } from "react-redux";

const TransactionDetails = ({ setFieldValue, values }) => {
  const readOnly = useSelector((state) => state.admin.expenses.readOnly);

  // Dynamic label for discount
  const discountLabel = values.discountType === "percentage" ? "Discount (%)" : "Discount (Amount)";

  // Calculate financial fields
  const calculateFields = useCallback(() => {
    const { total_amount = 0, tax = 0, penalty = 0, paid_amount = 0, discount = 0, discountType } = values;

    const discountValue = discountType === "percentage" ? (total_amount * discount) / 100 : discount;
    const taxValue = (total_amount * tax) / 100;
    const finalAmount = total_amount + taxValue - discountValue + penalty;
    const remainingAmount = finalAmount - paid_amount;

    setFieldValue("finalAmount", finalAmount.toFixed(2));
    setFieldValue("remaining_amount", remainingAmount.toFixed(2));
  }, [setFieldValue, values]);

  useEffect(() => {
    calculateFields();
  }, [calculateFields]);

  // Define transaction fields
  const transactionDetailsFields = [
    { type: "select", label: "Billing Period", name: "billingPeriod", options: ["Monthly", "Quarterly", "Yearly"] },
    { type: "select", label: "Payment Status", name: "paymentStatus", options: ["paid", "unpaid", "partial", "advance"] },
    { type: "select", label: "Payment Type", name: "paymentType", options: ["cash", "card", "online", "cheque", "other"] },
    { type: "number", label: "Total Amount", name: "total_amount", placeholder: "Enter total amount" },
    { type: "number", label: "Tax (%)", name: "tax", placeholder: "Enter tax percentage" },
    { type: "select", label: "Discount Type", name: "discountType", options: ["amount", "percentage"] },
    { type: "number", label: discountLabel, name: "discount", placeholder: `Enter ${values.discountType === "percentage" ? "discount percentage" : "discount amount"}` },
    { type: "number", label: "Penalty", name: "penalty", placeholder: "Enter penalty amount" },
    { type: "number", label: "Final Amount", name: "finalAmount", placeholder: "Auto-calculated", readOnly: true },
    { type: "number", label: "Paid Amount (QR)", name: "paid_amount", placeholder: "Enter paid amount", min: 0 },
    { type: "number", label: "Remaining Amount (QR)", name: "remaining_amount", placeholder: "Auto-calculated", readOnly: true },
    { type: "array", label: "Documents", name: "document", fields: [{ type: "file", label: "Document", name: "document" }], emptyItem: "" },
  ];

  // Conditional fields based on payment type
  const paymentTypeFields = {
    card: { type: "text", label: "Card Transaction ID", name: "cardTransactionId", placeholder: "Enter card transaction ID" },
    online: { type: "text", label: "Online Transaction ID", name: "onlineTransactionId", placeholder: "Enter online transaction ID" },
    cheque: { type: "text", label: "Cheque Number", name: "chequeNumber", placeholder: "Enter cheque number" },
  };

  if (values.paymentType in paymentTypeFields) {
    transactionDetailsFields.push(paymentTypeFields[values.paymentType]);
  }

  return (
    <FormSection
      title="Transaction Details"
      fields={transactionDetailsFields}
      setFieldValue={setFieldValue}
      values={values}
    />
  );
};

TransactionDetails.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};

export default TransactionDetails;
