import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import TransactionDetails from "../Components/TransactionDetails";

const UtilitiesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const utilityDetailsFields = [
    {
      type: "select",
      label: "Utility Type",
      name: "utilityType",
      options: ["electricity", "water", "internet", "gas", "other"],
    },

    {
      type: "text",
      label: "Name",
      name: "name",
      placeholder: "Enter name",
    },
    {
      type: "text",
      label: "vendor",
      name: "vendor",
      placeholder: "Enter vendor name",
    },
  ];

  return (
    <>
      <FormSection
        title="Utility Details"
        fields={utilityDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />
      <TransactionDetails setFieldValue={setFieldValue} values={values} />
    </>
  );
};

export default UtilitiesForm;
