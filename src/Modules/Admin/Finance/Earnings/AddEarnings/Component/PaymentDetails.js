// src/Components/Admin/Finance/Earnings/EarningsForm/PaymentDetails.jsx

import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection";

const paymentDetailsFields = [
  {
    name: "frequencyOfPayment",
    label: "Frequency of Payment",
    type: "select",
    options: ["Monthly", "Quarterly", "Half Yearly", "Yearly", "Custom Date"],
  },
  {
    name: "dateTime",
    label: "Date & Time",
    type: "datetime-local",
    placeholder: "Select Date & Time",
  },
  {
    name: "discount",
    label: "Discount (%)",
    type: "number",
    placeholder: "Enter discount percentage",
    min: 0,
  },
  {
    name: "penalty",
    label: "Penalty (QR)",
    type: "number",
    placeholder: "Enter penalty amount",
    min: 0,
  },
  {
    name: "total_amount",
    label: "Total Amount (QR)",
    type: "number",
    placeholder: "Enter total amount",
    min: 0,
  },
  {
    name: "final_amount",
    label: "Final Amount (After Tax/Discount/Penalty) (QR)",
    type: "number",
    placeholder: "Enter final amount",
    min: 0,
  },
];

const PaymentDetails = () => {
  const { setFieldValue, values } = useFormikContext();

  return (
    <FormSection
      title="Payment Details"
      fields={paymentDetailsFields}
      setFieldValue={setFieldValue}
      values={values}
    />
  );
};

export default PaymentDetails;
