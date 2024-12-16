import React from "react";
import { useFormikContext } from "formik";
import TextInput from "./TextInput";
import * as Yup from "yup";
const PaymentDetails = () => {
  const { values } = useFormikContext();

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Payment Details
      </h2>
      <div className="grid grid-cols-3 gap-6">
        <TextInput
          label="Date & Time"
          name="dateTime"
          type="datetime-local"
          value={values.dateTime}
        />
        <TextInput
          label="Tax (Inc/Exc)"
          name="tax"
          placeholder="Enter tax percentage"
          value={values.tax}
        />
        <TextInput
          label="Discount"
          name="discount"
          placeholder="Enter discount percentage"
          value={values.discount}
        />
        <TextInput
          label="Penalty"
          name="penalty"
          placeholder="Enter penalty amount"
          value={values.penalty}
        />
        <TextInput
          label="Total Amount"
          name="totalAmount"
          placeholder="Enter total amount"
          value={values.totalAmount}
        />
        <TextInput
          label="Final amount (After tax/discount/penalty)"
          name="finalAmount"
          placeholder="Enter final amount"
          value={values.finalAmount}
        />
      </div>
    </div>
  );
};

// Define initialValues and validationSchema for reuse
PaymentDetails.initialValues = {
  dateTime: "",
  tax: "",
  discount: "",
  penalty: "",
  totalAmount: "",
  finalAmount: "",
};

PaymentDetails.validationSchema = {
  dateTime: Yup.date().required("Date & Time is required"),
  tax: Yup.number()
    .required("Tax is required")
    .min(0, "Invalid tax percentage"),
  discount: Yup.number().min(0, "Invalid discount percentage"),
  penalty: Yup.number().min(0, "Invalid penalty amount"),
  totalAmount: Yup.number().required("Total amount is required").min(0),
  finalAmount: Yup.number().required("Final amount is required").min(0),
};

export default PaymentDetails;
