// src/Components/Admin/Finance/Earnings/EarningsForm/StationeryFeesForm.jsx
import React from "react";
import PaymentDetails from "../Component/PaymentDetails"; // Static component for payment details
import PaymentStatus from "../Component/PaymentStatus"; // Static component for payment status
import StationeryItemsSection from "./StationeryItemsSection";

const StationeryFeesForm = () => {
  return (
    <>
      {/* Stationery Items Section */}
      <h2 style={{ marginBottom: "16px" }}>Stationery Items</h2>
      <StationeryItemsSection />

      {/* Static PaymentDetails and PaymentStatus Sections */}
      <PaymentDetails />
      <PaymentStatus />
    </>
  );
};

export default StationeryFeesForm;
