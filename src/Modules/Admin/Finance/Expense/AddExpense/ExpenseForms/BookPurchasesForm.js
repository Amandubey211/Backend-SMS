import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const BookPurchasesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Expense Details
  const expenseDetailsFields = [
    {
      type: "text",
      label: "Book Title",
      name: "bookTitle",
      placeholder: "Enter book title",
    },
    {
      type: "text",
      label: "Subject/Genre",
      name: "subject",
      placeholder: "Enter subject/genre",
    },
    {
      type: "number",
      label: "Quantity",
      name: "quantity",
      placeholder: "Enter book quantity",
    },
    {
      type: "number",
      label: "Cost Per Book",
      name: "costPerBook",
      placeholder: "Enter cost per book",
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

export default BookPurchasesForm;
