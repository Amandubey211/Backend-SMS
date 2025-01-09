import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";
import ItemsSection from "../Components/ItemsSection";
import TransactionDetails from "../Components/TransactionDetails";

const PrintingExamPapersForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const expenseDetailsFields = [
    {
      type: "text",
      label: "Name",
      name: "name",
      placeholder: "Enter name",
    },
    {
      type: "text",
      label: "Vendor",
      name: "vendor",
      placeholder: "Enter vendor name",
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
      <ItemsSection type="exam" />

      <TransactionDetails setFieldValue={setFieldValue} values={values} />
    </>
  );
};

export default PrintingExamPapersForm;
