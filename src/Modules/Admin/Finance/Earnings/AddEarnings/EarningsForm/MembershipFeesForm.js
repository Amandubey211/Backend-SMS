import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const MembershipFeesForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Membership Details Fields
  const membershipDetailsFields = [
    {
      name: "memberName",
      label: "Member Name",
      type: "text",
      placeholder: "Enter member name",
    },
    {
      name: "subscriptionPlan",
      label: "Subscription Plan",
      type: "select",
      options: ["Basic", "Premium", "VIP"],
    },
    {
      name: "membershipId",
      label: "Membership ID",
      type: "text",
      placeholder: "Enter membership ID",
    },
    {
      name: "renewalDate",
      label: "Renewal Date",
      type: "date",
    },
  ];

  return (
    <>
      {/* Membership Details Section */}
      <FormSection
        title="Membership Details"
        fields={membershipDetailsFields}
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

export default MembershipFeesForm;
