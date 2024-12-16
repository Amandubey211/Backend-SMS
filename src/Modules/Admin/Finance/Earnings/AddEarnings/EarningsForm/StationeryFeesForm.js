import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const validationSchema = Yup.object({
  studentName: Yup.string().required("Student Name is required"),
  class: Yup.string().required("Class is required"),
  section: Yup.string().required("Section is required"),
  dueDate: Yup.date().required("Due Date is required"),
  dueTime: Yup.string().required("Due Time is required"),
});

const StudentFeesForm = ({ description, formData, onFormChange }) => {
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
    <Formik
      initialValues={formData} // Pass the formData as initial values
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values); // This will log the data when the form is submitted
        onFormChange(values); // Send the updated values back to the parent
      }}
    >
      {({ setFieldValue }) => (
        <Form className="bg-white px-5 py-2">
          {/* Student Details Section - Dynamic Fields */}
          <FormSection
            title="Student Details"
            fields={studentDetailsFields}
            setFieldValue={setFieldValue}
          />

          {/* Due Details Section - Dynamic Fields */}
          <FormSection
            title="Due Details"
            fields={dueDetailsFields}
            setFieldValue={setFieldValue}
          />

          {/* Static PaymentDetails and PaymentStatus Sections */}
          <PaymentDetails onFormChange={onFormChange} />
          <PaymentStatus onFormChange={onFormChange} />
        </Form>
      )}
    </Formik>
  );
};

export default StudentFeesForm;
