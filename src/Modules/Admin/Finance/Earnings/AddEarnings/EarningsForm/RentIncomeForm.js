import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";
import Button from "../Component/Button";

// Configuration for Rent Details Fields
const rentDetailsFields = [
  {
    name: "rentName",
    label: "Rent Name",
    type: "text",
    placeholder: "Enter rent name",
  },
  {
    name: "organisationName",
    label: "User/Organisation Name",
    type: "text",
    placeholder: "Enter name",
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
  rentName: Yup.string().required("Rent Name is required"),
  organisationName: Yup.string().required("User/Organisation Name is required"),
  timePeriod: Yup.string().required("Time Period is required"),
});

const RentIncomeForm = ({ formData, onFormChange }) => {
  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Submitted Values:", values);
        onFormChange(values); // Pass updated values to parent
      }}
    >
      {({ setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md">
          {/* Rent Details Section */}
          <FormSection
            title="Rent Details"
            fields={rentDetailsFields}
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

export default RentIncomeForm;
