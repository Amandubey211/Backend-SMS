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
    label: "Book Name",
    name: "bookName",
    placeholder: "Enter book name",
  },
  {
    type: "number",
    label: "Price Per Book",
    name: "pricePerBook",
    placeholder: "Enter price",
  },
  {
    type: "number",
    label: "Quantity Sold",
    name: "quantitySold",
    placeholder: "Enter quantity sold",
  },
  {
    type: "date",
    label: "Sale Date",
    name: "saleDate",
  },
  {
    type: "text",
    label: "Buyer Name",
    name: "buyerName",
    placeholder: "Enter buyer name",
  },
];

// Validation Schema
const validationSchema = Yup.object({
  bookName: Yup.string().required("Book Name is required"),
  pricePerBook: Yup.number()
    .required("Price Per Book is required")
    .min(0, "Price must be a positive number"),
  quantitySold: Yup.number()
    .required("Quantity Sold is required")
    .min(1, "Quantity Sold must be at least 1"),
  saleDate: Yup.date().required("Sale Date is required"),
  buyerName: Yup.string().required("Buyer Name is required"),
});

const BookSalesForm = ({ formData, onFormChange }) => {
  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Submitted Values:", values);
        onFormChange(values); // Pass updated values to parent
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

          {/* Payment Details Section */}
          <PaymentDetails onFormChange={onFormChange} />

          {/* Payment Status Section */}
          <PaymentStatus onFormChange={onFormChange} />
        </Form>
      )}
    </Formik>
  );
};

export default BookSalesForm;
