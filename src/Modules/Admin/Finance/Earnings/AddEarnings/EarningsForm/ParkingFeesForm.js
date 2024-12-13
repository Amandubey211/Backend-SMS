import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../Component/TextInput";
import SelectInput from "../Component/SelectInput";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

const validationSchema = Yup.object({
  vehicleType: Yup.string().required("Vehicle Type is required"),
  nameOfPerson: Yup.string().required("Name of Person is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits"),
  userType: Yup.string().required("User Type is required"),
  ...PaymentDetails.validationSchema,
  ...PaymentStatus.validationSchema,
});

const ParkingFeesForm = () => {
  return (
    <Formik
      initialValues={{
        vehicleType: "",
        nameOfPerson: "",
        phoneNumber: "",
        userType: "",
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
          {/* Parking Details Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Parking Details
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <TextInput
                label="Vehicle Type"
                name="vehicleType"
                placeholder="Enter vehicle type"
              />
              <TextInput
                label="Name Of Person"
                name="nameOfPerson"
                placeholder="Enter name"
              />
              <TextInput
                label="Phone Number"
                name="phoneNumber"
                placeholder="Enter phone number"
              />
              <SelectInput
                label="User Type"
                name="userType"
                options={["Employee", "Visitor", "Other"]}
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

export default ParkingFeesForm;
