import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

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

// Validation Schema
const validationSchema = Yup.object({
  memberName: Yup.string().required("Member Name is required"),
  subscriptionPlan: Yup.string().required("Subscription Plan is required"),
  membershipId: Yup.string().required("Membership ID is required"),
  renewalDate: Yup.date().required("Renewal Date is required"),
});

const MembershipFeesForm = ({ formData, onFormChange }) => {
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
          {/* Membership Details Section */}
          <FormSection
            title="Membership Details"
            fields={membershipDetailsFields}
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

export default MembershipFeesForm;
