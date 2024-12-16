import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";
import FormSection from "../Component/FormSection";

// Configuration for Student Details Fields
const studentDetailsFields = [
  {
    name: "studentName",
    label: "Student Name",
    type: "text",
    placeholder: "Enter Name",
  },
  { name: "class", label: "Class", type: "text", placeholder: "Enter Class" },
  {
    name: "section",
    label: "Section",
    type: "text",
    placeholder: "Enter Section",
  },
];

// Configuration for Payment Additional Details Fields
const additionalPaymentFields = [
  {
    name: "examType",
    label: "Exam Type",
    type: "select",
    options: ["Term 1", "Term 2"],
  },
];

// Configuration for Due Details Fields
const dueDetailsFields = [
  {
    name: "dueDate",
    label: "Due Date",
    type: "date",
    placeholder: "Enter Due Date",
  },
  {
    name: "dueTime",
    label: "Due Time",
    type: "time",
    placeholder: "Enter Due Time",
  },
];

// Validation Schema
const validationSchema = Yup.object({
  studentName: Yup.string().required("Student Name is required"),
  class: Yup.string().required("Class is required"),
  section: Yup.string().required("Section is required"),
  frequencyOfPayment: Yup.string().required("Frequency of Payment is required"),
  dateTime: Yup.date().required("Date & Time is required"),
  examType: Yup.string().required("Exam Type is required"),
  dueDate: Yup.date().required("Due Date is required"),
  dueTime: Yup.string().required("Due Time is required"),
});

const ExamFeesForm = ({ description, formData, onFormChange }) => {
  return (
    <Formik
      initialValues={{
        studentName: "",
        class: "",
        section: "",
        frequencyOfPayment: "",
        dateTime: "",
        examType: "",
        dueDate: "",
        dueTime: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Submitted Values:", values);
        onFormChange(values);
      }}
    >
      {({ setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md">
          {/* Student Details Section */}
          <FormSection
            title="Student Details"
            fields={studentDetailsFields}
            setFieldValue={setFieldValue}
          />

          {/* Static PaymentDetails Component */}
          <PaymentDetails onFormChange={onFormChange} />

          {/* Additional Payment Fields */}
          <FormSection
            title="Additional Payment Details"
            fields={additionalPaymentFields}
            setFieldValue={setFieldValue}
          />

          {/* Due Details Section */}
          <FormSection
            title="Due Details"
            fields={dueDetailsFields}
            setFieldValue={setFieldValue}
          />
          {/* Static PaymentStatus Component */}
          <PaymentStatus setFieldValue={setFieldValue} />

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
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

export default ExamFeesForm;
