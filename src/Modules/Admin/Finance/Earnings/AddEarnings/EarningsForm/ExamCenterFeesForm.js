import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

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

// Validation Schema
const validationSchema = Yup.object({
  examName: Yup.string().required("Exam Name is required"),
  userOrganisationName: Yup.string().required(
    "User/Organisation Name is required"
  ),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits"),
  timePeriod: Yup.string().required("Time Period is required"),
});

const ExamCenterFeesForm = ({ formData, onFormChange }) => {
  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Submitted Values:", values);
        onFormChange(values);
      }}
    >
      {({ setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md">
          {/* Exam Center Details Section */}
          <FormSection
            title="Exam Center Details"
            fields={examCenterDetailsFields}
            setFieldValue={setFieldValue}
          />

          {/* Static Payment Details Component */}
          <PaymentDetails onFormChange={onFormChange} />

          {/* Static Payment Status Component */}
          <PaymentStatus setFieldValue={setFieldValue} />
        </Form>
      )}
    </Formik>
  );
};

export default ExamCenterFeesForm;
