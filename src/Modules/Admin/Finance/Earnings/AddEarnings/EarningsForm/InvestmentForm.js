import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";
import Button from "../Component/Button";

// Configuration for Investment Details Fields
const investmentDetailsFields = [
  {
    name: "investmentName",
    label: "Investment Name",
    type: "text",
    placeholder: "Enter investment name",
  },
  {
    name: "returnAmount",
    label: "Return Amount",
    type: "number",
    placeholder: "Enter return amount",
  },
  {
    name: "timePeriod",
    label: "Time Period",
    type: "text",
    placeholder: "Enter time period",
  },
  {
    name: "profitLoss",
    label: "Profit/Loss",
    type: "number",
    placeholder: "Enter Profit/Loss",
  },
];

// Validation Schema
const validationSchema = Yup.object({
  investmentName: Yup.string().required("Investment Name is required"),
  returnAmount: Yup.number()
    .required("Return Amount is required")
    .min(0, "Invalid amount"),
  timePeriod: Yup.string().required("Time Period is required"),
  profitLoss: Yup.number().required("Profit/Loss is required"),
});

const InvestmentForm = ({ formData, onFormChange }) => {
  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Submitted Values:", values);
        onFormChange(values); // Pass updated values to parent
      }}
    >
      {({ setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md">
          {/* Investment Details Section */}
          <FormSection
            title="Investment Details"
            fields={investmentDetailsFields}
            setFieldValue={setFieldValue}
          />

          {/* Payment Details Section */}
          <PaymentDetails onFormChange={onFormChange} />

          {/* Payment Status Section */}
          <PaymentStatus onFormChange={onFormChange} />
        </Form>
      )}
    </Formik>
  );
};

export default InvestmentForm;
