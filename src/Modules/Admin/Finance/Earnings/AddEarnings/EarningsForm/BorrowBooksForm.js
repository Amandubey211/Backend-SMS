import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";
import FormSection from "../Component/FormSection";
import Button from "../Component/Button";

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

const validationSchema = Yup.object({
  borrowerName: Yup.string().required("Borrower Name is required"),
  titleOfBook: Yup.string().required("Title of Book is required"),
  dueDate: Yup.date().required("Due Date is required"),
  overdueDays: Yup.number().min(0, "Invalid overdue days"),
  ...PaymentDetails.validationSchema,
  ...PaymentStatus.validationSchema,
});

const BorrowBooksForm = () => {
  return (
    <Formik
      initialValues={{
        borrowerName: "",
        titleOfBook: "",
        dueDate: "",
        overdueDays: "",
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
            <Button type="submit" disabled={isSubmitting} variant="primary">
              Submit
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BorrowBooksForm;
