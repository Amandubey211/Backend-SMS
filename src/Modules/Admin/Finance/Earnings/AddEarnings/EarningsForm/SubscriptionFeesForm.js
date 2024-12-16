import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

// Configuration for Subscription Details Fields
const subscriptionDetailsFields = [
  {
    name: "subscriptionName",
    label: "Subscription Name",
    type: "text",
    placeholder: "Enter subscription name",
  },
  {
    name: "description",
    label: "Any Description",
    type: "text",
    placeholder: "Enter description",
  },
];

// Validation Schema
const validationSchema = Yup.object({
  subscriptionName: Yup.string().required("Subscription Name is required"),
  description: Yup.string(),
});

const SubscriptionFeesForm = ({ formData, onFormChange }) => {
  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Submitted Values:", values);
        onFormChange(values); // Pass values back to parent
      }}
    >
      {({ setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md">
          {/* Subscription Details Section */}
          <FormSection
            title="Subscription Details"
            fields={subscriptionDetailsFields}
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

export default SubscriptionFeesForm;
