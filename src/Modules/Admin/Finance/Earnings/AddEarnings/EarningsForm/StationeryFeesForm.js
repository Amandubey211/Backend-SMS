import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../Component/TextInput";
import SelectInput from "../Component/SelectInput";
import FileInput from "../Component/FileInput";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

const validationSchema = Yup.object({
  itemName: Yup.string().required("Item Name is required"),
  itemCost: Yup.number()
    .required("Item Cost is required")
    .min(0, "Invalid cost"),
  itemQuantity: Yup.number()
    .required("Item Quantity is required")
    .min(1, "Invalid quantity"),
  dateTime: Yup.date().required("Date & Time is required"),
  tax: Yup.number()
    .required("Tax is required")
    .min(0, "Invalid tax percentage"),
  discount: Yup.number().min(0, "Invalid discount percentage"),
  penalty: Yup.number().min(0, "Invalid penalty amount"),
  totalAmount: Yup.number().required("Total amount is required").min(0),
  finalAmount: Yup.number().required("Final amount is required").min(0),
  paymentStatus: Yup.string().required("Payment Status is required"),
  paidAmount: Yup.number().min(0, "Invalid paid amount"),
  paymentType: Yup.string().required("Payment Type is required"),
  advanceAmount: Yup.number().min(0, "Invalid advance amount"),
  remainingAmount: Yup.number().min(0, "Invalid remaining amount"),
  chequeNumber: Yup.string(),
  transactionId: Yup.string(),
  receipt: Yup.mixed().required("Receipt/document is required"),
});

const StationeryFeesForm = () => {
  return (
    <Formik
      initialValues={{
        itemName: "",
        itemCost: "",
        itemQuantity: "",
        dateTime: "",
        tax: "",
        discount: "",
        penalty: "",
        totalAmount: "",
        finalAmount: "",
        paymentStatus: "",
        paidAmount: "",
        paymentType: "",
        advanceAmount: "",
        remainingAmount: "",
        chequeNumber: "",
        transactionId: "",
        receipt: null,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md">
          {/* Product Details Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Product Details
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <TextInput
                label="Item Name"
                name="itemName"
                placeholder="Enter item name"
              />
              <TextInput
                label="Item Cost"
                name="itemCost"
                placeholder="Enter cost"
              />
              <TextInput
                label="Item Quantity"
                name="itemQuantity"
                placeholder="Enter quantity"
              />
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

export default StationeryFeesForm;
