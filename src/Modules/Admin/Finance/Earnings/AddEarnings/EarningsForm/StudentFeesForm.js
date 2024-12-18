// StudentFeesForm.jsx
import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

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

const StudentFeesForm = () => {
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

      {/* Due Details Section */}
      <FormSection
        title="Due Details"
        fields={dueDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Payment Details Section */}
      <PaymentDetails />

      {/* Payment Status Section */}
      <PaymentStatus />
    </>
  );
};

export default StudentFeesForm;
