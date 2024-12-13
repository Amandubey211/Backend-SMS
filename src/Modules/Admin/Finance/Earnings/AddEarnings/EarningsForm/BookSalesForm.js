import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

const validationSchema = Yup.object({
  bookName: Yup.string().required("Book Name is required"),
  pricePerBook: Yup.number().required("Price Per Book is required").min(0),
  quantitySold: Yup.number().required("Quantity Sold is required").min(1),
  saleDate: Yup.date().required("Sale Date is required"),
  buyerName: Yup.string().required("Buyer Name is required"),
  // PaymentDetails and PaymentStatus validations
  ...PaymentDetails.validationSchema,
  ...PaymentStatus.validationSchema,
});

const BookSalesForm = () => {
  const bookDetailsFields = [
    {
      type: "text",
      label: "Book Name",
      name: "bookName",
      placeholder: "Enter book name",
    },
    {
      type: "text",
      label: "Price Per Book",
      name: "pricePerBook",
      placeholder: "Enter price",
      inputType: "number",
    },
    {
      type: "text",
      label: "Quantity Sold",
      name: "quantitySold",
      placeholder: "Enter quantity sold",
      inputType: "number",
    },
    {
      type: "text",
      label: "Sale Date",
      name: "saleDate",
      placeholder: "Select sale date",
      inputType: "date",
    },
    {
      type: "text",
      label: "Buyer Name",
      name: "buyerName",
      placeholder: "Enter buyer name",
    },
  ];

  return (
    <Formik
      initialValues={{
        bookName: "",
        pricePerBook: "",
        quantitySold: "",
        saleDate: "",
        buyerName: "",
        // Initial values for PaymentDetails and PaymentStatus
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
          {/* Book Details Section */}
          <FormSection title="Book Details" fields={bookDetailsFields} />

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

export default BookSalesForm;
