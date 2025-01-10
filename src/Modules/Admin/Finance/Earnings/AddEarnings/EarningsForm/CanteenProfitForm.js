// src/Components/Admin/Finance/Earnings/EarningsForm/WorkshopTrainingFeesForm.jsx

import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const WorkshopTrainingFeesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const workshopDetailsFields = [
    {
      name: "sessionTitle",
      label: "Session Title",
      type: "text",
      placeholder: "Enter session title",
    },
    {
      name: "hostName",
      label: "Host Name",
      type: "text",
      placeholder: "Enter host name",
    },
    {
      name: "timePeriod",
      label: "Time Period",
      type: "text",
      placeholder: "Enter time period",
    },
  ];

  return (
    <>
      {/* Workshop/Training Details Section */}
      <FormSection
        title="Workshop/Training Details"
        fields={workshopDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Static PaymentDetails and PaymentStatus Sections */}
      <PaymentDetails />
      <PaymentStatus />
    </>
  );
};

export default WorkshopTrainingFeesForm;
