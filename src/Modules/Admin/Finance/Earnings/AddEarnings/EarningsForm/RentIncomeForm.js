// src/Components/Admin/Finance/Earnings/EarningsForm/RentIncomeForm.jsx

import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

const RentIncomeForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Fields required by the backend for Rent Income
  const rentDetailsFields = [
    {
      name: "name",
      label: "Facility/Item Name",
      type: "text",
      placeholder: "Enter the name of the rented facility/item",
    },
    {
      name: "nameOfRenter",
      label: "Name of Renter",
      type: "text",
      placeholder: "Enter the name of the renter",
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
