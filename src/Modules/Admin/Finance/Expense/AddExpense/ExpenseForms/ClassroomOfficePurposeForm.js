import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const ClassroomOfficePurposeForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const expenseDetailsFields = [
    {
      type: "text",
      label: "Items Purchased",
      name: "name",
      placeholder: "Enter item names (separated by comma)",
    },
    {
      type: "text",
      label: "Vendor Name",
      name: "vendor",
      placeholder: "Enter vendor name",
    },
    // {
    //   type: "text",
    //   label: "Bill Number",
    //   name: "billNumber",
    //   placeholder: "Enter bill number",
    // },
    { type: "date", label: "Purchased Date ", name: "purchasedDate" },
  ];

  const billingDetailsFields = [
    {
      type: "select",
      label: "Billing Period",
      name: "billingPeriod",
      options: ["Monthly", "Quarterly", "Annually"],
    },
    {
      type: "datetime-local",
      label: "Date & Time",
      name: "dateTime",
      placeholder: "Enter date and time",
    },
    {
      type: "number",
      label: "Total Amount",
      name: "totalAmount",
      placeholder: "Enter total amount",
    },
    {
      type: "number",
      label: "Tax (Inc/Exc)",
      name: "tax",
      placeholder: "Enter tax percentage",
    },
    {
      type: "number",
      label: "Discount",
      name: "discount",
      placeholder: "Enter discount amount",
    },
    {
      type: "number",
      label: "Penalty",
      name: "penalty",
      placeholder: "Enter penalty amount",
    },
    {
      type: "number",
      label: "Final Amount (After tax/discount/penalty)",
      name: "finalAmount",
      placeholder: "Enter final amount",
    },
    {
      type: "file",
      label: "Add Receipt/Document",
      name: "receipt",
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

export default ClassroomOfficePurposeForm;
