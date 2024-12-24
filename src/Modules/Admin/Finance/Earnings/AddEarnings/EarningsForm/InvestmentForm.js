// src/Components/Admin/Finance/Earnings/EarningsForm/InvestmentForm.jsx

import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const InvestmentForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Investment Details Fields
  const investmentDetailsFields = [
    {
      name: "name",
      label: "Investment Name",
      type: "text",
      placeholder: "Enter investment name",
    },
    {
      name: "profitOrLoss",
      label: "Profit/Loss",
      type: "select",
      options: ["Profit", "Loss", "Break-even"],
      placeholder: "Select Profit/Loss",
    },
    {
      name: "fromDate",
      label: "Start Date",
      type: "date",
      placeholder: "Select start date",
    },
    {
      name: "toDate",
      label: "End Date",
      type: "date",
      placeholder: "Select end date",
    },
    {
      name: "investmentAmount",
      label: "Investment Amount",
      type: "number",
      placeholder: "Enter investment amount",
    },
    {
      name: "returnAmount",
      label: "Return Amount",
      type: "number",
      placeholder: "Enter return amount",
    },
  ];

  return (
    <>
      {/* Investment Details Section */}
      <FormSection
        title="Investment Details"
        fields={investmentDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Static Payment Details and Payment Status Sections */}
      <PaymentDetails />
      <PaymentStatus />
    </>
  );
};

export default InvestmentForm;
