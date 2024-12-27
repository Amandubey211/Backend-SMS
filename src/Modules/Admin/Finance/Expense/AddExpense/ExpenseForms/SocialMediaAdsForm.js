import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const SocialMediaAdsForm = () => {
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
    {
      name: "platformName",
      label: "Platform Name",
      type: "text",
      placeholder: "Enter platform name (e.g., Facebook, Instagram)",
    },
    {
      name: "campaignName",
      label: "Campaign Name",
      type: "text",
      placeholder: "Enter campaign name",
    },
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

export default SocialMediaAdsForm;
