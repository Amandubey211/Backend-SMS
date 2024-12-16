import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";
import Button from "../Component/Button";

// Configuration for Fundraising Details Fields
const fundraisingDetailsFields = [
  {
    name: "fundName",
    label: "Fund Name",
    type: "text",
    placeholder: "Enter fund name",
  },
];

// Validation Schema
const validationSchema = Yup.object({
  fundName: Yup.string().required("Fund Name is required"),
});

const FundraisingForm = ({ formData, onFormChange }) => {
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
          {/* Fundraising Details Section */}
          <FormSection
            title="Fundraising Details"
            fields={fundraisingDetailsFields}
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

export default FundraisingForm;
