// src/Components/Admin/Finance/Earnings/EarningsForm/ExamCenterFeesForm.jsx

import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const examFeesFields = [
  {
    name: "examName",
    label: "Exam Name",
    type: "text",
    placeholder: "Enter the name of the exam",
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
    name: "mobileNumber",
    label: "Mobile Number",
    type: "text",
    placeholder: "Enter mobile number",
  },
];

const ExamCenterFeesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  return (
    <>
      {/* Exam Center Details Section */}
      <FormSection
        title="Exam Center Details"
        fields={examFeesFields}
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
