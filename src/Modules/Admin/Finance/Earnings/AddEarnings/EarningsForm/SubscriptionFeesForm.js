import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const SubscriptionFeesForm = () => {
  const { setFieldValue, values } = useFormikContext();

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

  return (
    <>
      {/* Subscription Details Section */}
      <FormSection
        title="Subscription Details"
        fields={subscriptionDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Static PaymentDetails Component */}
      <PaymentDetails />

      {/* Static PaymentStatus Component */}
      <PaymentStatus />
    </>
  );
};

export default SubscriptionFeesForm;
