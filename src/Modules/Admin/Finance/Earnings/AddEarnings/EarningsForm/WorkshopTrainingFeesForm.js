import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";
import FormSection from "../Component/FormSection"; // Reusable FormSection

// Configuration for Workshop/Training Details Fields
const workshopDetailsFields = [
  {
    name: "sessionName",
    label: "Session Name",
    type: "text",
    placeholder: "Enter session here",
  },
  {
    name: "hostName",
    label: "Host Name",
    type: "text",
    placeholder: "Enter host name",
  },
  {
    name: "startDateTime",
    label: "Start Date & Time",
    type: "datetime-local",
    placeholder: "Select start date and time",
  },
  {
    name: "endDateTime",
    label: "End Date & Time",
    type: "datetime-local",
    placeholder: "Select end date and time",
  },
];

// Validation Schema
const validationSchema = Yup.object({
  sessionName: Yup.string().required("Session Name is required"),
  hostName: Yup.string().required("Host Name is required"),
  startDateTime: Yup.date().required("Start Date & Time is required"),
  endDateTime: Yup.date()
    .required("End Date & Time is required")
    .test(
      "is-after-start",
      "End Date & Time must be after Start Date & Time",
      function (value) {
        const { startDateTime } = this.parent;
        return new Date(value) > new Date(startDateTime);
      }
    ),
});

const WorkshopTrainingFeesForm = ({ formData, onFormChange }) => {
  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Submitted Values:", values);
        onFormChange(values); // Send updated data back to parent
      }}
    >
      {({ setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md">
          {/* Workshop/Training Details Section */}
          <FormSection
            title="Workshop/Training Details"
            fields={workshopDetailsFields}
            setFieldValue={setFieldValue}
          />

          {/* Static PaymentDetails Component */}
          <PaymentDetails onFormChange={onFormChange} />

          {/* Static PaymentStatus Component */}
          <PaymentStatus setFieldValue={setFieldValue} />
        </Form>
      )}
    </Formik>
  );
};

export default WorkshopTrainingFeesForm;
