import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

const FundraisingForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Fundraising Details Fields
  const fundraisingDetailsFields = [
    {
      name: "fundName",
      label: "Fund Name",
      type: "text",
      placeholder: "Enter fund name",
    },
  ];

  return (
    <>
      {/* Fundraising Details Section */}
      <FormSection
        title="Fundraising Details"
        fields={fundraisingDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Static Payment Details and Payment Status Sections */}
      <PaymentDetails />
      <PaymentStatus />
    </>
  );
};

export default FundraisingForm;
