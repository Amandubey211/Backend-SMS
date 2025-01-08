// src/components/TeachingStaffForm.js

import React, { useEffect } from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import StaffSelect from "../Components/StaffSelect";

const TeachingStaffForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Staff Details
  const staffDetailsFields = [
    {
      type: "text",
      label: "Mail ID",
      name: "email",
      placeholder: "Enter mail ID",
    },
    // Add more staff detail fields as needed
  ];

  // Configuration for Salary Details
  const salaryDetailsFields = [
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
      name: "payment_type",
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
      name: "paid_amount",
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
      readOnly: true,
    },
    {
      type: "file",
      label: "Add Receipt/Document",
      name: "receipt",
    },
  ];

  return (
    <>
      {/* Staff Selection Section */}
      <StaffSelect
        name="staffId"
        label="Select Teaching Staff"
        setFieldValue={setFieldValue}
        value={values.staffId}
        staffType="teaching"
      />

      {/* Staff Details Section
      <FormSection
        title="Staff Details"
        fields={staffDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      /> */}

      {/* Salary Details Section */}
      <FormSection
        title="Salary Details"
        fields={salaryDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Additional Sections as Needed */}
    </>
  );
};

export default TeachingStaffForm;
