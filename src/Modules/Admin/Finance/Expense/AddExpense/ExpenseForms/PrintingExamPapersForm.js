import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const PrintingExamPapersForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const expenseDetailsFields = [
    {
      name: "examType",
      label: "Exam Type",
      type: "select",
      options: ["Midterm", "Final", "Other"],
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "Enter description",
    },
    {
      name: "vendorName",
      label: "Vendor Name",
      type: "text",
      placeholder: "Enter vendor name",
    },
    {
      name: "numberOfCopies",
      label: "Number of Copies",
      type: "number",
      placeholder: "Enter number of copies",
    },
    {
      name: "costPerCopy",
      label: "Cost Per Copy",
      type: "number",
      placeholder: "Enter cost per copy",
    },
  ];

  const billingDetailsFields = [
    {
      name: "billingPeriod",
      label: "Billing Period",
      type: "select",
      options: ["Monthly", "Quarterly", "Yearly"],
    },
    { name: "dateTime", label: "Date & Time", type: "datetime-local" },
    {
      name: "totalAmount",
      label: "Total Amount",
      type: "number",
      placeholder: "Enter total amount",
    },
    {
      name: "tax",
      label: "Tax (Inc/Exc)",
      type: "number",
      placeholder: "Enter tax percentage",
    },
    {
      name: "discount",
      label: "Discount",
      type: "number",
      placeholder: "Enter discount",
    },
    {
      name: "penalty",
      label: "Penalty",
      type: "number",
      placeholder: "Enter penalty amount",
    },
    {
      name: "finalAmount",
      label: "Final Amount",
      type: "number",
      placeholder: "Enter final amount",
    },
    { name: "receipt", label: "Add Receipt/Document", type: "file" },
  ];

  return (
    <>
      <FormSection
        title="Expense Details"
        fields={expenseDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />
      <FormSection
        title="Billing Details"
        fields={billingDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />
      <PaymentStatus />
    </>
  );
};

export default PrintingExamPapersForm;
