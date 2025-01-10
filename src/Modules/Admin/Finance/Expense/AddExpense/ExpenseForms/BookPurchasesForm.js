import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import ItemsSection from "../Components/ItemsSection";
import TransactionDetails from "../Components/TransactionDetails";

const BookPurchasesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Expense Details
  const expenseDetailsFields = [
    {
      type: "text",
      label: "Book Title",
      name: "name",
      placeholder: "Enter book title",
    },
    {
      type: "text",
      label: "vendor",
      name: "vendor",
      placeholder: "Enter vendor",
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
      <ItemsSection type="classroom" />

      <TransactionDetails setFieldValue={setFieldValue} values={values} />
    </>
  );
};

export default BookPurchasesForm;
