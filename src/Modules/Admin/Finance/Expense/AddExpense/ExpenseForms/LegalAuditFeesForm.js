import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import TransactionDetails from "../Components/TransactionDetails";

const LegalAuditFeesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const expenseDetailsFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter  name",
    },
    {
      name: "vendor",
      label: "vendor",
      type: "text",
      placeholder: "Enter  vendor",
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
      <TransactionDetails setFieldValue={setFieldValue} values={values} />
    </>
  );
};

export default LegalAuditFeesForm;
