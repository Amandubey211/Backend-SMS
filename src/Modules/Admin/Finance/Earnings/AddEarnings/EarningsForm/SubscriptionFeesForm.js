import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../Component/TextInput";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

const validationSchema = Yup.object({
  subscriptionName: Yup.string().required("Subscription Name is required"),
  description: Yup.string(),
  ...PaymentDetails.validationSchema,
  ...PaymentStatus.validationSchema,
});

const SubscriptionFeesForm = () => {
  return (
    <Formik
      initialValues={{
        subscriptionName: "",
        description: "",
        ...PaymentDetails.initialValues,
        ...PaymentStatus.initialValues,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md">
          {/* Subscription Details Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Subscription Details
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <TextInput
                label="Subscription Name"
                name="subscriptionName"
                placeholder="Enter subscription name"
              />
              <TextInput
                label="Any Description"
                name="description"
                placeholder="Enter description"
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

export default SubscriptionFeesForm;
