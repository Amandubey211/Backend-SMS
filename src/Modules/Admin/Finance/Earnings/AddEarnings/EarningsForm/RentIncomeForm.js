// RentIncomeForm.jsx
import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const RentIncomeForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Rent Details Fields
  const rentDetailsFields = [
    {
      name: "rentName",
      label: "Rent Name",
      type: "text",
      placeholder: "Enter rent name",
    },
    {
      name: "organisationName",
      label: "User/Organisation Name",
      type: "text",
      placeholder: "Enter name",
    },
    {
      name: "timePeriod",
      label: "Time Period",
      type: "text",
      placeholder: "Enter time period",
    },
    // Add other fields specific to Rent Income if needed
  ];

  return (
    <>
      {/* Rent Details Section */}
      <FormSection
        title="Rent Details"
        fields={rentDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Static Payment Details Section */}
      <PaymentDetails />

      {/* Static Payment Status Section */}
      <PaymentStatus />
    </>
  );
};

export default RentIncomeForm;
