import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const EquipmentRentalsForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const expenseDetailsFields = [
    {
      type: "text",
      label: "Event Name",
      name: "eventName",
      placeholder: "Enter event name",
    },
    {
      type: "select",
      label: "Equipment Type",
      name: "equipmentType",
      options: ["Sound", "Lighting", "Stage", "Other"],
    },
    { type: "date", label: "Rental Start Date", name: "rentalStartDate" },
    { type: "date", label: "Rental End Date", name: "rentalEndDate" },
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

export default EquipmentRentalsForm;
