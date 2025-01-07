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
      type: "select",
      label: "Utility Type",
      name: "utilityType",
      options: ["electricity", "water", "internet", "gas", "other"],
    },

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
    // {
    //   type: "text",
    //   label: "Vehicle Number/ID",
    //   name: "vehicleNumber",
    //   placeholder: "Enter vehicle number",
    // },
    // {
    //   type: "select",
    //   label: "Fuel Type",
    //   name: "fuelType",
    //   options: ["Petrol", "Diesel", "Electric", "Other"],
    // },
    // {
    //   type: "number",
    //   label: "Fuel Quantity (Litres)",
    //   name: "fuelQuantity",
    //   placeholder: "Enter quantity in litres",
    // },
    // {
    //   type: "number",
    //   label: "Cost Per Litre",
    //   name: "costPerLitre",
    //   placeholder: "Enter cost per litre",
    // },
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
      name: "paymentStatus",
      label: "Payment Status",
      type: "select",
      options: ["paid", "unpaid", "partial", "advance"],
    },
    // { type: "datetime-local", label: "Date & Time", name: "dateTime" },
    {
      name: "payment_type", // Changed to snake_case
      label: "Payment Type",
      type: "select",
      options: ["cash", "card", "online", "cheque", "other"],
    },

    // {
    //   name: "paid_by", // Changed to snake_case
    //   label: "Paid By",
    //   type: "select",
    //   options: ["Manual", "Auto"],
    // },

    {
      type: "select",
      label: "Discount Type",
      name: "discountType",
      options: ["amount", "percentage"],
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
      label: "Tax (Inc/Exc)",
      name: "tax",
      placeholder: "Enter tax percentage",
    },
    {
      type: "number",
      label: "Total Amount",
      name: "total_amount",
      placeholder: "Enter total amount",
    },
    {
      type: "number",
      label: "Final Amount",
      name: "final_amount",
      placeholder: "Enter final amount",
    },
    {
      name: "paid_amount", // Changed to snake_case
      label: "Paid Amount (QR)",
      type: "number",
      placeholder: "Enter paid amount",
      min: 0,
    },
    {
      name: "advance_amount",
      label: "Advance Amount (QR)",
      type: "number",
      placeholder: "Enter advance amount",
      min: 0,
    },
    {
      name: "remaining_amount",
      label: "Remaining Amount (QR)",
      type: "number",
      placeholder: "Enter remaining amount",
      min: 0,
      readOnly: true, // Make it read-only as it's calculated
    },
    { type: "file", label: "Add Receipt/Document", name: "receipt" },
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
      {/* <PaymentStatus /> */}
    </>
  );
};

export default FuelCostsForm;
