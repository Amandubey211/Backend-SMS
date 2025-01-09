import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";

const TransactionDetails = ({ setFieldValue, values }) => {
  // Determine the label for the discount field based on discountType
  const getDiscountLabel = () => {
    return values.discountType === "percentage"
      ? "Discount (%)"
      : "Discount (Amount)";
  };

  // Auto-calculate final_amount and remaining_amount
  const calculateFields = useCallback(() => {
    const totalAmount = parseFloat(values.total_amount || 0);
    const taxPercentage = parseFloat(values.tax || 0);
    const penalty = parseFloat(values.penalty || 0);
    const paidAmount = parseFloat(values.paid_amount || 0);
    const discountValue = parseFloat(values.discount || 0);

    let discount = 0;

    if (values.discountType === "percentage") {
      discount = (totalAmount * discountValue) / 100;
    } else {
      discount = discountValue;
    }

    const tax = (totalAmount * taxPercentage) / 100; // Calculate tax as percentage
    const finalAmount = totalAmount + tax - discount + penalty;
    const remainingAmount = finalAmount - paidAmount;

    setFieldValue("final_amount", finalAmount.toFixed(2));
    setFieldValue("remaining_amount", remainingAmount.toFixed(2));
  }, [setFieldValue, values]);

  useEffect(() => {
    calculateFields();
  }, [calculateFields]);

  // Define the reusable transaction-related fields
  const transactionDetailsFields = [
    {
      type: "select",
      label: "Billing Period",
      name: "billingPeriod",
      options: ["Monthly", "Quarterly", "Yearly"],
    },
    {
      name: "paymentStatus",
      label: "Payment Status",
      type: "select",
      options: ["paid", "unpaid", "partial", "advance"],
    },
    {
      name: "paymentType",
      label: "Payment Type",
      type: "select",
      options: ["cash", "card", "online", "cheque", "other"],
    },
    {
      type: "number",
      label: "Total Amount",
      name: "total_amount",
      placeholder: "Enter total amount",
    },
    {
      type: "number",
      label: "Tax (%)",
      name: "tax",
      placeholder: "Enter tax percentage",
    },
    {
      type: "select",
      label: "Discount Type",
      name: "discountType",
      options: ["amount", "percentage"], // Options for discount type
    },
    {
      type: "number",
      label: getDiscountLabel(), // Dynamically set the label
      name: "discount",
      placeholder: `Enter ${
        values.discountType === "percentage"
          ? "discount percentage"
          : "discount amount"
      }`,
    },
    {
      type: "number",
      label: "Penalty",
      name: "penalty",
      placeholder: "Enter penalty amount",
    },
    {
      type: "number",
      label: "Final Amount",
      name: "finalAmount",
      placeholder: "Auto-calculated",
      readOnly: true,
    },
    {
      name: "paid_amount",
      label: "Paid Amount (QR)",
      type: "number",
      placeholder: "Enter paid amount",
      min: 0,
    },
    {
      name: "remaining_amount",
      label: "Remaining Amount (QR)",
      type: "number",
      placeholder: "Auto-calculated",
      readOnly: true,
    },
    {
      type: "file",
      label: "Add Receipt/Document",
      name: "receipt",
    },
  ];

  // Add conditional fields based on payment_type
  if (values.payment_type === "card") {
    transactionDetailsFields.push({
      type: "text",
      label: "Card Transaction ID",
      name: "cardTransactionId",
      placeholder: "Enter card transaction ID",
    });
  } else if (values.payment_type === "online") {
    transactionDetailsFields.push({
      type: "text",
      label: "Online Transaction ID",
      name: "onlineTransactionId",
      placeholder: "Enter online transaction ID",
    });
  } else if (values.payment_type === "cheque") {
    transactionDetailsFields.push({
      type: "text",
      label: "Cheque Number",
      name: "chequeNumber",
      placeholder: "Enter cheque number",
    });
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
