// ExamFeesForm.jsx
import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

// Configuration for Student Details Fields
const studentDetailsFields = [
  {
    name: "studentName",
    label: "Student Name",
    type: "text",
    placeholder: "Enter Name",
  },
  {
    name: "class",
    label: "Class",
    type: "text",
    placeholder: "Enter Class",
  },
  {
    name: "section",
    label: "Section",
    type: "text",
    placeholder: "Enter Section",
  },
];

// Configuration for Payment Additional Details Fields
const additionalPaymentFields = [
  {
    name: "examType",
    label: "Exam Type",
    type: "select",
    options: ["Term 1", "Term 2"],
  },
];

// Configuration for Due Details Fields
const dueDetailsFields = [
  {
    name: "dueDate",
    label: "Due Date",
    type: "date",
    placeholder: "Enter Due Date",
  },
  {
    name: "dueTime",
    label: "Due Time",
    type: "time",
    placeholder: "Enter Due Time",
  },
];

const ExamFeesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  return (
    <>
      {/* Student Details Section */}
      <FormSection
        title="Student Details"
        fields={studentDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Payment Details Section */}
      <PaymentDetails />

      {/* Additional Payment Details Section */}
      <FormSection
        title="Additional Payment Details"
        fields={additionalPaymentFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Due Details Section */}
      <FormSection
        title="Due Details"
        fields={dueDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Payment Status Section */}
      <PaymentStatus />
    </>
  );
};

export default ExamFeesForm;
