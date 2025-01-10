// src/Components/Admin/Finance/Earnings/EarningsForm/DonationForm.jsx

import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const DonationForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Donation Details section
  // For Donations: name is required, phoneNumber & address optional
  const donationDetailsFields = [
    {
      name: "name",
      label: "Donor Name",
      type: "text",
      placeholder: "Enter donor's name",
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
      {/* Donation Details Section */}
      <FormSection
        title="Donation Details"
        fields={donationDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Static PaymentDetails and PaymentStatus Sections */}
      <PaymentDetails />
      <PaymentStatus />
    </>
  );
};

export default DonationForm;
