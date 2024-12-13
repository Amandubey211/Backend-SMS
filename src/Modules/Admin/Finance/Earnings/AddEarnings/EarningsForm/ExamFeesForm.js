import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../Component/TextInput";
import SelectInput from "../Component/SelectInput";
import FileInput from "../Component/FileInput";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";
import FormSection from "../Component/FormSection";

const studentDetailsFields = [
  {
    type: "text",
    name: "studentName",
    label: "Student Name",
    placeholder: "Enter Name",
  },
  { type: "text", name: "class", label: "Class", placeholder: "Enter Class" },
  {
    type: "text",
    name: "section",
    label: "Section",
    placeholder: "Enter Section",
  },
];

const paymentDetailsFields = [
  {
    type: "select",
    name: "frequency",
    label: "Frequency Of Payment",
    options: ["Monthly", "Quarterly", "Half yearly", "Yearly", "Custom Date"],
  },
  { type: "datetime-local", name: "dateTime", label: "Date & Time" },
  {
    type: "select",
    name: "examType",
    label: "Exam Type",
    options: ["Term 1", "Term 2"],
  },
];

const dueDetailsFields = [
  { type: "date", name: "dueDate", label: "Due Date" },
  { type: "time", name: "dueTime", label: "Due Time" },
];

const validationSchema = Yup.object({
  studentName: Yup.string().required("Student Name is required"),
  class: Yup.string().required("Class is required"),
  section: Yup.string().required("Section is required"),
  frequency: Yup.string().required("Frequency is required"),
  dateTime: Yup.date().required("Date & Time is required"),
  examType: Yup.string().required("Exam Type is required"),
  dueDate: Yup.date().required("Due Date is required"),
  dueTime: Yup.string().required("Due Time is required"),
  ...PaymentDetails.validationSchema,
  ...PaymentStatus.validationSchema,
});

const ExamFeesForm = () => {
  return (
    <Formik
      initialValues={{
        studentName: "",
        class: "",
        section: "",
        frequency: "",
        dateTime: "",
        examType: "",
        dueDate: "",
        dueTime: "",
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
          {/* Student Details Section */}
          <FormSection title="Student Details" fields={studentDetailsFields} />

          {/* Payment Details Section */}
          <PaymentDetails />

          {/* Additional Payment Fields */}
          <FormSection
            title="Additional Payment Details"
            fields={paymentDetailsFields}
          />

          {/* Due Details Section */}
          <FormSection title="Due Details" fields={dueDetailsFields} />

          {/* Payment Status Section */}
          <PaymentStatus setFieldValue={setFieldValue} />

          {/* Submit Button */}
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

export default ExamFeesForm;
