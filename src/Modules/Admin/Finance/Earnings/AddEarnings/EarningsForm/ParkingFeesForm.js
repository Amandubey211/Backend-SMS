// src/Components/Admin/Finance/Earnings/EarningsForm/ParkingFeesForm.jsx

import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const parkingDetailsFields = [
  {
    name: "vehicleType",
    label: "Vehicle Type",
    type: "select",
    options: ["car", "bike", "bicycle", "bus", "van", "other"],
    placeholder: "Select vehicle type",
  },
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter name",
  },
  {
    name: "userType",
    label: "User Type",
    type: "select",
    options: ["staff", "student", "other"],
    placeholder: "Select user type",
  },
  {
    name: "otherVehicleDetails",
    label: "Other Vehicle Details",
    type: "text",
    placeholder: "Provide details if vehicle type is 'other'",
  },
  {
    name: "otherUserDetails",
    label: "Other User Details",
    type: "text",
    placeholder: "Provide details if user type is 'other'",
  },
];

const ParkingFeesForm = () => {
  const { setFieldValue, values } = useFormikContext();

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
