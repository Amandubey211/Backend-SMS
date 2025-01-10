import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const PrizesAndGiftsForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Expense Details Section
  const expenseDetailsFields = [
    {
      type: "text",
      label: "Event Name",
      name: "eventName",
      placeholder: "Enter event name",
    },
    {
      type: "number",
      label: "Total Prizes",
      name: "totalPrizes",
      placeholder: "Enter total prizes",
    },
    {
      type: "number",
      label: "Total Gifts",
      name: "totalGifts",
      placeholder: "Enter total gifts",
    },
    {
      type: "number",
      label: "Total Certificates",
      name: "totalCertificates",
      placeholder: "Enter total certificates",
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

  // Billing Details Section
  const billingDetailsFields = [
    {
      type: "select",
      label: "Billing Period",
      name: "billingPeriod",
      options: ["Monthly", "Quarterly", "Annually"],
    },
    { type: "datetime-local", label: "Date & Time", name: "dateTime" },
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
      placeholder: "Enter discount",
    },
    {
      type: "number",
      label: "Penalty",
      name: "penalty",
      placeholder: "Enter penalty amount",
    },
    { type: "file", label: "Add Receipt/Document", name: "receipt" },
    {
      type: "number",
      label: "Final Amount (After tax/discount/penalty)",
      name: "finalAmount",
      placeholder: "Enter net amount",
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

export default PrizesAndGiftsForm;
