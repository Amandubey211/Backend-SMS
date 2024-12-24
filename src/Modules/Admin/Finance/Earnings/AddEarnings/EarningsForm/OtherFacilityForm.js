// src/Components/Admin/Finance/Earnings/EarningsForm/OtherFacilityForm.jsx

import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const OtherFacilityForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const otherFacilityFields = [
    {
      name: "facilityName",
      label: "Facility Name",
      type: "text",
      placeholder: "Enter facility name",
    },
    {
      name: "accessDuration",
      label: "Access Duration",
      type: "text",
      placeholder: "Enter access duration",
    },
  ];

  return (
    <>
      {/* Other Facility Details Section */}
      <FormSection
        title="Other Facility Details"
        fields={otherFacilityFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Static PaymentDetails and PaymentStatus Sections */}
      <PaymentDetails />
      <PaymentStatus />
    </>
  );
};

export default OtherFacilityForm;
