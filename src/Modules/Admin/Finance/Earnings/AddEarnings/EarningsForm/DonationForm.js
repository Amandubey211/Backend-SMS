import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../Component/TextInput";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits"),
  address: Yup.string().required("Address is required"),
  ...PaymentDetails.validationSchema, // Reusing PaymentDetails validation schema
  ...PaymentStatus.validationSchema, // Reusing PaymentStatus validation schema
});

const DonationForm = () => {
  return (
    <Formik
      initialValues={{
        name: "",
        phoneNumber: "",
        address: "",
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
          {/* Donation Details Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Donation Details
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <TextInput label="Name" name="name" placeholder="Enter name" />
              <TextInput
                label="Phone Number"
                name="phoneNumber"
                placeholder="Enter phone number"
              />
              <TextInput
                label="Address"
                name="address"
                placeholder="Enter Address"
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

export default DonationForm;
