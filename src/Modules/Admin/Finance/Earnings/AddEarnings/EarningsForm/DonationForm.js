import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";
import Button from "../Component/Button";

// Configuration for Donation Details Fields
const donationDetailsFields = [
  {
    name: "name",
    label: "Name",
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
    name: "address",
    label: "Address",
    type: "text",
    placeholder: "Enter address",
  },
];

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits"),
  address: Yup.string().required("Address is required"),
});

const DonationForm = ({ formData, onFormChange }) => {
  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Submitted Values:", values);
        onFormChange(values); // Send updated values back to parent
      }}
    >
      {({ setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md">
          {/* Donation Details Section */}
          <FormSection
            title="Donation Details"
            fields={donationDetailsFields}
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

export default DonationForm;
