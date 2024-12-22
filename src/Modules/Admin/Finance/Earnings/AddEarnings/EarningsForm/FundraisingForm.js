// src/Components/Admin/Finance/Earnings/EarningsForm/FundraisingForm.jsx

import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const FundraisingForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Fundraising Details Fields
  // For Fundraising/Sponsorships: companyName is required
  // phoneNumber and address optional
  const fundraisingDetailsFields = [
    {
      name: "companyName",
      label: "Company/Sponsor Name",
      type: "text",
      placeholder: "Enter company/sponsor name",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "text",
      placeholder: "Enter phone number (optional)",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "Enter address (optional)",
    },
  ];

  return (
    <>
      {/* Fundraising Details Section */}
      <FormSection
        title="Fundraising/Sponsorship Details"
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
