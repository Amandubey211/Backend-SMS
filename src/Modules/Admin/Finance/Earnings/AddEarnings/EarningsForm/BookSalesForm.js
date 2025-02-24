import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection"; // Reusable FormSection
import PaymentDetails from "../Component/PaymentDetails"; // Static Component
import PaymentStatus from "../Component/PaymentStatus"; // Static Component

const BookSalesForm = () => {
  const { setFieldValue, values } = useFormikContext();

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
      label: "Price Per Book (QR)",
      name: "pricePerBook",
      placeholder: "Enter price per book",
      min:0
    },
    {
      type: "number",
      label: "Quantity Sold",
      name: "quantitySold",
      placeholder: "Enter quantity sold",
      min:0
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

  return (
    <>
      {/* Book Details Section */}
      <FormSection
        title="Book Details"
        fields={bookDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Static Payment Details Section */}
      <PaymentDetails />

      {/* Static Payment Status Section */}
      <PaymentStatus />
    </>
  );
};

export default BookSalesForm;
