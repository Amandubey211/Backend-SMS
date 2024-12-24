import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";
const FuelCostsForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Fuel Costs Fields
  const fuelDetailsFields = [
    {
      type: "select",
      label: "Vehicle Type",
      name: "vehicleType",
      options: ["Car", "Bus", "Bike", "Truck"], // Add as required
    },
    {
      type: "text",
      label: "Vehicle Number/ID",
      name: "vehicleNumber",
      placeholder: "Enter vehicle number",
    },
    {
      type: "select",
      label: "Fuel Type",
      name: "fuelType",
      options: ["Petrol", "Diesel", "Electric", "Other"],
    },
    {
      type: "number",
      label: "Fuel Quantity (Litres)",
      name: "fuelQuantity",
      placeholder: "Enter quantity in litres",
    },
    {
      type: "number",
      label: "Cost Per Litre",
      name: "costPerLitre",
      placeholder: "Enter cost per litre",
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
        fields={fuelDetailsFields}
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

export default FuelCostsForm;
