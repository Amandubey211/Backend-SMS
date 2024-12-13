import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../Component/TextInput";
import SelectInput from "../Component/SelectInput";
import FileInput from "../Component/FileInput";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

const validationSchema = Yup.object({
  periodOfEarnings: Yup.string().required("Period Of Earnings is required"),
  description: Yup.string(),
  ...PaymentDetails.validationSchema,
  ...PaymentStatus.validationSchema,
});

const CanteenProfitForm = () => {
  return (
    <Formik
      initialValues={{
        periodOfEarnings: "",
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
          {/* Canteen Profit Details Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Canteen Profit
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <SelectInput
                label="Period Of Earnings"
                name="periodOfEarnings"
                options={["Monthly", "Quarterly", "Half-yearly", "Yearly"]}
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

export default CanteenProfitForm;
