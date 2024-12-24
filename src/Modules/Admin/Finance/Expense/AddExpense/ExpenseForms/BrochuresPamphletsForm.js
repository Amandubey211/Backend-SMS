import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const BrochuresPamphletsForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const expenseDetailsFields = [
    {
      name: "materialType",
      label: "Material Type",
      type: "text",
      placeholder: "Enter material type (e.g., Brochures, Pamphlets)",
    },
    {
      name: "designCost",
      label: "Design Cost",
      type: "number",
      placeholder: "Enter design cost",
    },
    {
      name: "printCost",
      label: "Print Cost",
      type: "number",
      placeholder: "Enter print cost",
    },
    {
      name: "numberOfCopies",
      label: "Number of Copies",
      type: "number",
      placeholder: "Enter number of copies",
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "Enter description",
    },
    {
      name: "supplierName",
      label: "Supplier Name",
      type: "text",
      placeholder: "Enter supplier name",
    },
  ];

  const billingDetailsFields = [
    {
      name: "subscriptionPeriod",
      label: "Subscription Period",
      type: "select",
      options: ["Weekly", "Monthly", "Yearly"],
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

export default BrochuresPamphletsForm;
