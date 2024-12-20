import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

const InvestmentForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Investment Details Fields
  const investmentDetailsFields = [
    {
      name: "investmentName",
      label: "Investment Name",
      type: "text",
      placeholder: "Enter investment name",
    },
    {
      name: "returnAmount",
      label: "Return Amount",
      type: "number",
      placeholder: "Enter return amount",
    },
    {
      name: "startDate",
      label: "Start Date",
      type: "date",
      placeholder: "Select start date",
    },
    {
      name: "endDate",
      label: "End Date",
      type: "date",
      placeholder: "Select end date",
    },
    {
      name: "profitLoss",
      label: "Profit/Loss",
      type: "number",
      placeholder: "Enter Profit/Loss",
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
