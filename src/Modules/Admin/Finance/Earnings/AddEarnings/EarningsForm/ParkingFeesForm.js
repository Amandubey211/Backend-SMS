import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const ParkingFeesForm = () => {
  const { setFieldValue, values } = useFormikContext();

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

  return (
    <>
      {/* Parking Details Section */}
      <FormSection
        title="Parking Details"
        fields={parkingDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Static PaymentDetails Component */}
      <PaymentDetails />

      {/* Static PaymentStatus Component */}
      <PaymentStatus />
    </>
  );
};

export default ParkingFeesForm;
