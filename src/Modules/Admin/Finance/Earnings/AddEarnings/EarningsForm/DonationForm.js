import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const DonationForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Donation Details section
  const donationDetailsFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter name",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "text",
      placeholder: "Enter phone number",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "Enter address",
    },
  ];

  return (
    <>
      {/* Donation Details Section - Dynamic Fields */}
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
