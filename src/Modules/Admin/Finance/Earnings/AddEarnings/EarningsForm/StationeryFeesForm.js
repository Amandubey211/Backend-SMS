// src/Components/Admin/Finance/Earnings/EarningsForm/StationeryFeesForm.jsx

import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const StationeryFeesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const stationeryDetailsFields = [
    {
      name: "stationeryItems",
      label: "Stationery Items",
      type: "array",
      emptyItem: { itemName: "", quantity: 0, unitCost: 0 },
      subFields: [
        {
          name: "itemName",
          label: "Item Name",
          type: "text",
          placeholder: "Enter item name",
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          placeholder: "Enter quantity",
        },
        {
          name: "unitCost",
          label: "Unit Cost",
          type: "number",
          placeholder: "Enter unit cost",
        },
      ],
    },
  ];

  return (
    <>
      {/* Stationery Items Section */}
      <FormSection
        title="Stationery Items"
        fields={stationeryDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Static PaymentDetails and PaymentStatus Sections */}
      <PaymentDetails />
      <PaymentStatus />
    </>
  );
};

export default StationeryFeesForm;
