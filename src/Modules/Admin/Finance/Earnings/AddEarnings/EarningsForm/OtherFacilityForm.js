import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const OtherFacilityForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Other Facility Details Fields
  const otherFacilityFields = [
    {
      name: "earningsFrom",
      label: "Earnings From",
      type: "text",
      placeholder: "Write here",
    },
    {
      name: "duration",
      label: "Duration",
      type: "text",
      placeholder: "Enter duration",
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

      {/* Static PaymentDetails Component */}
      <PaymentDetails />

      {/* Static PaymentStatus Component */}
      <PaymentStatus />
    </>
  );
};

export default OtherFacilityForm;
