import React, { useEffect } from "react";
import { useFormikContext } from "formik";
import FormSection from "./FormSection";

const paymentDetailsFields = [
  { name: "dueDate", label: "Due Date", type: "text", placeholder: "Enter date and time" },
  { name: "subAmount", label: "Sub Amount", type: "number", placeholder: "Enter sub total" },
  { name: "tax", label: "Tax (Inc/Exc)", type: "number", placeholder: "Enter tax percentage" },
  { name: "discount", label: "Discount", type: "number", placeholder: "Enter deduction" },
  { name: "penalty", label: "Penalty", type: "number", placeholder: "Enter penalty amount" },
  {
    name: "finalAmount",
    label: "Final amount (After tax/discount/penalty)",
    type: "number",
    placeholder: "Enter final amount",
    readOnly: true,
  },
  {
    name: "document",
    label: "Add document (if any)",
    type: "file",
    placeholder: "Upload file",
  },
];

const PaymentDetails = () => {
  const { setFieldValue, values } = useFormikContext();

  useEffect(() => {
    const subAmount = Number(values.subAmount) || 0;
    const tax = Number(values.tax) || 0;
    const discount = Number(values.discount) || 0;
    const penalty = Number(values.penalty) || 0;

    // Calculate final amount
    const calculatedFinalAmount = subAmount + tax + penalty - discount;

    // Avoid unnecessary updates to the field
    if (values.finalAmount !== calculatedFinalAmount) {
      setFieldValue("finalAmount", calculatedFinalAmount);
    }
  }, [values.subAmount, values.tax, values.discount, values.penalty, values.finalAmount, setFieldValue]);

  return (
    <FormSection
      title="Payment Details"
      fields={paymentDetailsFields}
      setFieldValue={setFieldValue}
      values={values}
    />
  );
};

export default PaymentDetails;
