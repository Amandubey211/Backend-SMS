import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const StudentFeesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Student Details section
  const studentDetailsFields = [
    {
      name: "studentName",
      label: "Student Name",
      type: "text",
      placeholder: "Enter Name",
    },
    { name: "class", label: "Class", type: "text", placeholder: "Enter Class" },
    {
      name: "section",
      label: "Section",
      type: "text",
      placeholder: "Enter Section",
    },
  ];

  // Configuration for Due Details section
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

  return (
    <>
      {/* Student Details Section - Dynamic Fields */}
      <FormSection
        title="Student Details"
        fields={studentDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Due Details Section - Dynamic Fields */}
      <FormSection
        title="Due Details"
        fields={dueDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Static PaymentDetails and PaymentStatus Sections */}
      <PaymentDetails />
      <PaymentStatus />
    </>
  );
};

export default StudentFeesForm;
