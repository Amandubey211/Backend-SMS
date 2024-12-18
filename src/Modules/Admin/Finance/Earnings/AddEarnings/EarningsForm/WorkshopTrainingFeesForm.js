import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const WorkshopTrainingFeesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Workshop/Training Details Fields
  const workshopDetailsFields = [
    {
      name: "sessionName",
      label: "Session Name",
      type: "text",
      placeholder: "Enter session here",
    },
    {
      name: "hostName",
      label: "Host Name",
      type: "text",
      placeholder: "Enter host name",
    },
    {
      name: "startDateTime",
      label: "Start Date & Time",
      type: "datetime-local",
      placeholder: "Select start date and time",
    },
    {
      name: "endDateTime",
      label: "End Date & Time",
      type: "datetime-local",
      placeholder: "Select end date and time",
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

      {/* Static PaymentDetails Component */}
      <PaymentDetails />

      {/* Static PaymentStatus Component */}
      <PaymentStatus />
    </>
  );
};

export default WorkshopTrainingFeesForm;
