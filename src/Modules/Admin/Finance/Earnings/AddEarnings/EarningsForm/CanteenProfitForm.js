import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

// Configuration for Canteen Profit Details Fields
const canteenProfitFields = [
  {
    name: "periodOfEarnings",
    label: "Period Of Earnings",
    type: "select",
    options: ["Monthly", "Quarterly", "Half-yearly", "Yearly"],
  },
  {
    name: "description",
    label: "Any Description",
    type: "text",
    placeholder: "Enter description",
  },
];

// Validation Schema
const validationSchema = Yup.object({
  periodOfEarnings: Yup.string().required("Period Of Earnings is required"),
  description: Yup.string(),
});

const CanteenProfitForm = ({ formData, onFormChange }) => {
  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Submitted Values:", values);
        onFormChange(values); // Pass values back to parent
      }}
    >
      {({ setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md">
          {/* Canteen Profit Details Section */}
          <FormSection
            title="Canteen Profit"
            fields={canteenProfitFields}
            setFieldValue={setFieldValue}
          />

          {/* Static Payment Details Component */}
          <PaymentDetails onFormChange={onFormChange} />

          {/* Static Payment Status Component */}
          <PaymentStatus setFieldValue={setFieldValue} />
        </Form>
      )}
    </Formik>
  );
};

export default CanteenProfitForm;
