// src/Components/Admin/Finance/Earnings/EarningsForm/SubscriptionFeesForm.jsx

import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const SubscriptionFeesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const subscriptionDetailsFields = [
    {
      name: "subscriptionName",
      label: "Subscription Name",
      type: "text",
      placeholder: "Enter subscription name",
    },
    {
      name: "description",
      label: "Description",
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

      {/* Static PaymentDetails and PaymentStatus Sections */}
      <PaymentDetails />
      <PaymentStatus />
    </>
  );
};

export default SubscriptionFeesForm;
