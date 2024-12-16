import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../Component/TextInput";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

const validationSchema = Yup.object({
  rentName: Yup.string().required("Rent Name is required"),
  organisationName: Yup.string().required("User/Organisation Name is required"),
  timePeriod: Yup.string().required("Time Period is required"),
  ...PaymentDetails.validationSchema, // Reusing PaymentDetails validation schema
  ...PaymentStatus.validationSchema, // Reusing PaymentStatus validation schema
});

const RentIncomeForm = () => {
  return (
    <Formik
      initialValues={{
        rentName: "",
        organisationName: "",
        timePeriod: "",
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
          {/* Rent Details Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Rent Details
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <TextInput
                label="Rent Name"
                name="rentName"
                placeholder="Enter rent name"
              />
              <TextInput
                label="User/Organisation Name"
                name="organisationName"
                placeholder="Enter name"
              />
              <TextInput
                label="Time Period"
                name="timePeriod"
                placeholder="Enter time period"
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

export default RentIncomeForm;
