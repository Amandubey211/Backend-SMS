import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const DigitalResourcesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Expense Details
  const expenseDetailsFields = [
    {
      type: "text",
      label: "Resource Name",
      name: "resourceName",
      placeholder: "Enter resource name",
    },
    {
      type: "select",
      label: "Resource Type",
      name: "resourceType",
      options: ["E-book", "Journal", "Subscription", "Other"],
    },
    {
      type: "text",
      label: "Access Model",
      name: "accessModel",
      placeholder: "Enter access model (e.g., One Time Subscription)",
    },
    {
      type: "text",
      label: "Description",
      name: "description",
      placeholder: "Enter description",
    },
    {
      type: "text",
      label: "Service Provider",
      name: "serviceProvider",
      placeholder: "Enter service provider",
    },
  ];

  return (
    <>
      <FormSection
        title="Expense Details"
        fields={expenseDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />
      <PaymentStatus />
    </>
  );
};

export default DigitalResourcesForm;
