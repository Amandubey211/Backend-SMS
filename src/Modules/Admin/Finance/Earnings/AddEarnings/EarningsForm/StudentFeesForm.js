import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

const validationSchema = Yup.object({
  studentName: Yup.string().required("Student Name is required"),
  class: Yup.string().required("Class is required"),
  section: Yup.string().required("Section is required"),
  dueDate: Yup.date().required("Due Date is required"),
  dueTime: Yup.string().required("Due Time is required"),
  // Add other validation rules...
});

const StudentFeesForm = ({ description, formData, onFormChange }) => {
  // Define form fields for each section
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
    }, // Ensure this is correct
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
      {({ isSubmitting, setFieldValue }) => (
        <Form className="bg-white px-5 py-2 ">
          {/* Student Details Section */}
          <FormSection
            title="Student Details"
            fields={studentDetailsFields}
            setFieldValue={setFieldValue}
          />

          {/* Due Details Section */}
          <FormSection
            title="Due Details"
            fields={dueDetailsFields}
            setFieldValue={setFieldValue}
          />

          {/* Payment Details Section */}
          <PaymentDetails onFormChange={onFormChange} />

          {/* Payment Status Section */}
          <PaymentStatus onFormChange={onFormChange} />
        </Form>
      )}
    </Formik>
  );
};

export default StudentFeesForm;
