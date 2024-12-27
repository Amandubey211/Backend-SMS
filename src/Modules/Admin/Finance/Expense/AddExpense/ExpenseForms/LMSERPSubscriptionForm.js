import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const LMSERPSubscriptionForm = () => {
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
    { type: "date", label: "Date", name: "Date" },

    // {
    //   name: "platformName",
    //   label: "Platform Name",
    //   type: "text",
    //   placeholder: "Enter platform name",
    // },
    // {
    //   name: "numberOfUsers",
    //   label: "Number Of Users",
    //   type: "number",
    //   placeholder: "Enter number of users",
    // },
    // {
    //   name: "costPerUser",
    //   label: "Cost Per User",
    //   type: "number",
    //   placeholder: "Enter cost per user",
    // },
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
      name: "final_amount",
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

export default LMSERPSubscriptionForm;
