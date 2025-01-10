import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import TransactionDetails from "../Components/TransactionDetails";

const DecorationsForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const decorationDetailsFields = [
    {
      type: "text",
      label: "Event Name",
      name: "eventName",
      placeholder: "Enter event name",
    },
    {
      type: "text",
      label: "vendor",
      name: "vendor",
      placeholder: "Enter vendor name",
    },

    { type: "date", label: "Start Date", name: "startDate" },

    { type: "date", label: "End Date", name: "endDate" },
  ];

  return (
    <>
      <FormSection
        title="Decoration Details"
        fields={decorationDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />
      <TransactionDetails setFieldValue={setFieldValue} values={values} />
    </>
  );
};

export default DecorationsForm;
