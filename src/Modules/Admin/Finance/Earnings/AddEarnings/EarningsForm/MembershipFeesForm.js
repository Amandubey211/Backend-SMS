import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../Component/TextInput";
import SelectInput from "../Component/SelectInput";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

const validationSchema = Yup.object({
  memberName: Yup.string().required("Member Name is required"),
  subscriptionPlan: Yup.string().required("Subscription Plan is required"),
  membershipId: Yup.string().required("Membership ID is required"),
  renewalDate: Yup.date().required("Renewal Date is required"),
  ...PaymentDetails.validationSchema,
  ...PaymentStatus.validationSchema,
});

const MembershipFeesForm = () => {
  return (
    <Formik
      initialValues={{
        memberName: "",
        subscriptionPlan: "",
        membershipId: "",
        renewalDate: "",
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
          {/* Membership Details Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Membership Details
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <TextInput
                label="Member Name"
                name="memberName"
                placeholder="Enter member name"
              />
              <SelectInput
                label="Subscription Plan"
                name="subscriptionPlan"
                options={["Basic", "Premium", "VIP"]}
              />
              <TextInput
                label="Membership ID"
                name="membershipId"
                placeholder="Enter membership ID"
              />
              <TextInput label="Renewal Date" name="renewalDate" type="date" />
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

export default MembershipFeesForm;
