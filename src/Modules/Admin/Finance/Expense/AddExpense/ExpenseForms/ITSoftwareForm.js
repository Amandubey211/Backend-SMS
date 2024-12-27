import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";
const ITSoftwareForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // IT and Software Fields
  const expenseDetailsFields = [
    {
      type: "select",
      label: "Maintenance Type",
      name: "maintenanceCategory",
      options: [
        "building",
        "furniture",
        "itEquipment",
        "stationery",
        "transport",
        "other",
      ],
    },
    {
      type: "text",
      label: "Building/Block Name",
      name: "buildingName",
      placeholder: "Enter building/block name",
    },
    {
      type: "select",
      label: "Equipment Type",
      name: "equipmentType",
      options: ["Laptops", "Servers", "Printers", "Other"],
    },
    {
      type: "select",
      label: "Expense Type",
      name: "expenseType",
      options: ["Subscription", "Purchase", "Maintenance"],
    },
    {
      type: "text",
      label: "Vendor Name",
      name: "vendorName",
      placeholder: "Enter vendor name",
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
    {
      type: "datetime-local",
      label: "Date & Time",
      name: "dateTime",
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
      label: "Final Amount",
      name: "finalAmount",
      placeholder: "Net amount after all calculations",
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

export default ITSoftwareForm;
