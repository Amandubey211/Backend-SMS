import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const UtilitiesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Utility Details
  const utilityDetailsFields = [
    {
      type: "select",
      label: "Utility Type",
      name: "utilityType",
      options: ["electricity", "water", "internet", "gas", "other"],
    },
    // {
    //   type: "text",
    //   label: "Bill Number/Invoice ID",
    //   name: "billNumber",
    //   placeholder: "Enter number",
    // },
    {
      type: "text",
      label: "Name",
      name: "name",
      placeholder: "Enter service provider name",
    },
    {
      type: "text",
      label: "vendor",
      name: "vendor",
      placeholder: "Enter vendor name",
    },

    // { type: "date", label: "Due Date", name: "dueDate" },
    {
      type: "number",
      label: "Unit Consumption",
      name: "unitConsumption",
      placeholder: "Enter unit consumption",
    },
    {
      type: "number",
      label: "Unit Per Cost",
      name: "unitCost",
      placeholder: "Enter unit per cost",
    },
  ];

  // Billing Details
  const billingDetailsFields = [
    {
      type: "select",
      label: "Billing Period",
      name: "billingPeriod",
      options: ["Monthly", "Quarterly", "Yearly"],
    },
    { type: "datetime-local", label: "Date & Time", name: "dateTime" },
    {
      type: "number",
      label: "Total Amount",
      name: "total_amount",
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
    {
      type: "number",
      label: "Final Amount",
      name: "final_amount",
      placeholder: "Enter final amount",
    },
    { type: "file", label: "Add Receipt/Document", name: "receipt" },
  ];

  return (
    <>
      <FormSection
        title="Utility Details"
        fields={utilityDetailsFields}
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

export default UtilitiesForm;
