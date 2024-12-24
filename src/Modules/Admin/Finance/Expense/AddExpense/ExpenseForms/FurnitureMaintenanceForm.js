import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const FurnitureMaintenanceForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const expenseDetailsFields = [
    {
      type: "text",
      label: "Building/Block Name",
      name: "buildingName",
      placeholder: "Enter building/block name",
    },
    {
      type: "select",
      label: "Furniture Type",
      name: "furnitureType",
      options: ["Chairs", "Tables", "Cabinets"],
    },
    {
      type: "select",
      label: "Expense Type",
      name: "expenseType",
      options: ["Repair", "Replacement", "Maintenance"],
    },
    {
      type: "text",
      label: "Vendor Name",
      name: "vendorName",
      placeholder: "Enter vendor name",
    },
  ];

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
    {
      type: "number",
      label: "Final Amount",
      name: "finalAmount",
      placeholder: "Enter final amount",
    },
    { type: "file", label: "Add Receipt/Document", name: "receipt" },
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

export default FurnitureMaintenanceForm;
