import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

// Configuration for Parking Details Fields
const parkingDetailsFields = [
  {
    name: "vehicleType",
    label: "Vehicle Type",
    type: "text",
    placeholder: "Enter vehicle type",
  },
  {
    name: "nameOfPerson",
    label: "Name Of Person",
    type: "text",
    placeholder: "Enter name",
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "text",
    placeholder: "Enter phone number",
  },
  {
    name: "userType",
    label: "User Type",
    type: "select",
    options: ["Employee", "Visitor", "Other"],
  },
];

// Validation Schema
const validationSchema = Yup.object({
  vehicleType: Yup.string().required("Vehicle Type is required"),
  nameOfPerson: Yup.string().required("Name of Person is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits"),
  userType: Yup.string().required("User Type is required"),
});

const ParkingFeesForm = ({ formData, onFormChange }) => {
  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Submitted Values:", values);
        onFormChange(values); // Pass form values to parent
      }}
    >
      {({ setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md">
          {/* Parking Details Section */}
          <FormSection
            title="Parking Details"
            fields={parkingDetailsFields}
            setFieldValue={setFieldValue}
          />

          {/* Static Payment Details Section */}
          <PaymentDetails onFormChange={onFormChange} />

          {/* Static Payment Status Section */}
          <PaymentStatus setFieldValue={setFieldValue} />
        </Form>
      )}
    </Formik>
  );
};

export default ParkingFeesForm;
