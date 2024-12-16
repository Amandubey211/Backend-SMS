import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";
import FormSection from "../Component/FormSection"; // Reusable FormSection

// Configuration for Other Facility Details Fields
const otherFacilityFields = [
  {
    name: "earningsFrom",
    label: "Earnings From",
    type: "text",
    placeholder: "Write here",
  },
  {
    name: "duration",
    label: "Duration",
    type: "text",
    placeholder: "Enter duration",
  },
];

// Validation Schema
const validationSchema = Yup.object({
  earningsFrom: Yup.string().required("Earnings From is required"),
  duration: Yup.string().required("Duration is required"),
});

const OtherFacilityForm = ({ formData, onFormChange }) => {
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
          {/* Other Facility Details Section */}
          <FormSection
            title="Other Facility Details"
            fields={otherFacilityFields}
            setFieldValue={setFieldValue}
          />

          {/* Static PaymentDetails Component */}
          <PaymentDetails onFormChange={onFormChange} />

          {/* Static PaymentStatus Component */}
          <PaymentStatus setFieldValue={setFieldValue} />
        </Form>
      )}
    </Formik>
  );
};

export default OtherFacilityForm;
