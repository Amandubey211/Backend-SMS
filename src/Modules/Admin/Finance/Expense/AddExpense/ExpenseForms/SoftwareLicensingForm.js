import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const SoftwareLicensingForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const expenseDetailsFields = [
    {
      name: "softwareName",
      label: "Software Name",
      type: "text",
      placeholder: "Enter software name",
    },
    {
      name: "licenseType",
      label: "License Type",
      type: "select",
      options: ["Single User", "Multi-User"],
    },
    { name: "dateOfPurchase", label: "Date Of Purchase", type: "date" },
    { name: "dateOfRenewal", label: "Date Of Renewal", type: "date" },
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "Enter description",
    },
  ];

  const billingDetailsFields = [
    {
      name: "subscriptionPeriod",
      label: "Subscription Period",
      type: "select",
      options: ["Monthly", "Yearly"],
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
      label: "Final Amount (After tax/discount/penalty)",
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

export default SoftwareLicensingForm;
