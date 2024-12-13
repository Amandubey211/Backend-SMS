import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../Component/TextInput";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

const validationSchema = Yup.object({
  investmentName: Yup.string().required("Investment Name is required"),
  returnAmount: Yup.number()
    .required("Return Amount is required")
    .min(0, "Invalid amount"),
  timePeriod: Yup.string().required("Time Period is required"),
  profitLoss: Yup.number().required("Profit/Loss is required"),
  ...PaymentDetails.validationSchema, // Reusing PaymentDetails validation schema
  ...PaymentStatus.validationSchema, // Reusing PaymentStatus validation schema
});

const InvestmentForm = () => {
  return (
    <Formik
      initialValues={{
        investmentName: "",
        returnAmount: "",
        timePeriod: "",
        profitLoss: "",
        ...PaymentDetails.initialValues, // Reusing PaymentDetails initial values
        ...PaymentStatus.initialValues, // Reusing PaymentStatus initial values
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md">
          {/* Investment Details Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Investment Details
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <TextInput
                label="Investment Name"
                name="investmentName"
                placeholder="Enter investment name"
              />
              <TextInput
                label="Return Amount"
                name="returnAmount"
                placeholder="Enter return amount"
              />
              <TextInput
                label="Time Period"
                name="timePeriod"
                placeholder="Enter time period"
              />
              <TextInput
                label="Profit/Loss"
                name="profitLoss"
                placeholder="Enter Profit/Loss"
              />
            </div>
          </div>

          {/* Payment Details Section */}
          <PaymentDetails />

          {/* Payment Status Section */}
          <PaymentStatus setFieldValue={setFieldValue} />

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium px-6 py-2 rounded-lg shadow-md hover:from-pink-600 hover:to-purple-600 transition"
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default InvestmentForm;
