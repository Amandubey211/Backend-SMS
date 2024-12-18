import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const CanteenProfitForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Canteen Profit Details Fields
  const canteenProfitFields = [
    {
      name: "periodOfEarnings",
      label: "Period Of Earnings",
      type: "select",
      options: ["Monthly", "Quarterly", "Half-yearly", "Yearly"],
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
      {/* Canteen Profit Details Section */}
      <FormSection
        title="Canteen Profit Details"
        fields={canteenProfitFields}
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

export default CanteenProfitForm;
