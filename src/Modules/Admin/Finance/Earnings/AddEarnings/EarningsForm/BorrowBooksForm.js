import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";
import Button from "../Component/Button";

// Configuration for Book Details Fields
const bookDetailsFields = [
  {
    type: "text",
    name: "borrowerName",
    label: "Borrower Name",
    placeholder: "Enter borrower name",
  },
  {
    type: "text",
    name: "titleOfBook",
    label: "Title Of Book",
    placeholder: "Enter title of book",
  },
  {
    type: "date",
    name: "dueDate",
    label: "Due Date",
  },
  {
    type: "number",
    name: "overdueDays",
    label: "Overdue Days",
    placeholder: "Enter overdue days",
  },
];

// Validation Schema
const validationSchema = Yup.object({
  borrowerName: Yup.string().required("Borrower Name is required"),
  titleOfBook: Yup.string().required("Title of Book is required"),
  dueDate: Yup.date().required("Due Date is required"),
  overdueDays: Yup.number()
    .min(0, "Invalid overdue days")
    .required("Overdue Days is required"),
});

const BorrowBooksForm = ({ formData, onFormChange }) => {
  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Submitted Values:", values);
        onFormChange(values);
      }}
    >
      {({ setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md">
          {/* Book Details Section */}
          <FormSection
            title="Book Details"
            fields={bookDetailsFields}
            setFieldValue={setFieldValue}
          />

          {/* Static Payment Details Section */}

          {/* Payment Details Section */}
          <PaymentDetails onFormChange={onFormChange} />

          {/* Payment Status Section */}
          <PaymentStatus onFormChange={onFormChange} />
        </Form>
      )}
    </Formik>
  );
};

export default BorrowBooksForm;
