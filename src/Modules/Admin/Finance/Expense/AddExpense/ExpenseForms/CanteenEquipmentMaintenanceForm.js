import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const CanteenEquipmentMaintenanceForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const expenseDetailsFields = [
    {
      name: "equipmentName",
      label: "Equipment Name",
      type: "text",
      placeholder: "Enter equipment name",
    },
    {
      name: "premiumAmount",
      label: "Premium Amount",
      type: "number",
      placeholder: "Enter premium amount",
    },
    {
      name: "coverageStart",
      label: "Coverage Period (Start)",
      type: "date",
    },
    {
      name: "coverageEnd",
      label: "Coverage Period (End)",
      type: "date",
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
      options: ["Monthly", "Quarterly", "Yearly"],
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

export default CanteenEquipmentMaintenanceForm;
