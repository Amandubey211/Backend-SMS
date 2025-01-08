import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
// import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const UtilitiesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Utility Details
  const utilityDetailsFields = [
    {
      type: "select",
      label: "Utility Type",
      name: "utilityType",
      options: ["electricity", "water", "internet", "gas", "other"],
    },

    {
      type: "text",
      label: "Name",
      name: "name",
      placeholder: "Enter service provider name",
    },
    {
      type: "text",
      label: "vendor",
      name: "vendor",
      placeholder: "Enter vendor name",
    },
  ];

  // Billing Details
  const billingDetailsFields = [
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
      name: "payment_type", // Changed to snake_case
      label: "Payment Type",
      type: "select",
      options: ["cash", "card", "online", "cheque", "other"],
    },

    {
      type: "select",
      label: "Discount Type",
      name: "discountType",
      options: ["amount", "percentage"],
    },
    {
      type: "number",
      label: "Discount",
      name: "discount",
      placeholder: "Enter discount",
    },
    {
      type: "number",
      label: "Penalty",
      name: "penalty",
      placeholder: "Enter penalty amount",
    },
    {
      type: "number",
      label: "Tax (Inc/Exc)",
      name: "tax",
      placeholder: "Enter tax percentage",
    },
    {
      type: "number",
      label: "Total Amount",
      name: "total_amount",
      placeholder: "Enter total amount",
    },
    {
      type: "number",
      label: "Final Amount",
      name: "final_amount",
      placeholder: "Enter final amount",
    },
    {
      name: "paid_amount", // Changed to snake_case
      label: "Paid Amount (QR)",
      type: "number",
      placeholder: "Enter paid amount",
      min: 0,
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
    { type: "file", label: "Add Receipt/Document", name: "receipt" },
  ];

  return (
    <>
      <FormSection
        title="Utility Details"
        fields={utilityDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />
      <FormSection
        title="Billing Details"
        fields={billingDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />
      {/* <PaymentStatus /> */}
    </>
  );
};

export default UtilitiesForm;
