import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const ExamCenterFeesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Exam Center Details Fields
  const examCenterDetailsFields = [
    {
      name: "examName",
      label: "Exam Name",
      type: "text",
      placeholder: "Enter exam name",
    },
    {
      name: "userOrganisationName",
      label: "User/Organisation Name",
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
      name: "timePeriod",
      label: "Time Period",
      type: "text",
      placeholder: "Enter time period",
    },
  ];

  return (
    <>
      {/* Exam Center Details Section */}
      <FormSection
        title="Exam Center Details"
        fields={examCenterDetailsFields}
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

export default ExamCenterFeesForm;
