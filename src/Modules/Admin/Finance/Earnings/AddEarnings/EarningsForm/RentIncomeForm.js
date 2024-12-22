// src/Components/Admin/Finance/Earnings/EarningsForm/RentIncomeForm.jsx

import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

const rentDetailsFields = [
  {
    name: "name",
    label: "Property Name",
    type: "text",
    placeholder: "Enter property name",
  },
  {
    name: "nameOfRenter",
    label: "Name of Renter",
    type: "text",
    placeholder: "Enter renter's name",
  },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    placeholder: "Select start date",
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
    placeholder: "Select end date",
  },
];

const RentIncomeForm = () => {
  const { setFieldValue, values } = useFormikContext();

  return (
    <>
      {/* Rent Details Section */}
      <FormSection
        title="Rent Details"
        fields={rentDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Payment Details Section */}
      <PaymentDetails />

      {/* Payment Status Section */}
      <PaymentStatus />
    </>
  );
};

export default RentIncomeForm;
