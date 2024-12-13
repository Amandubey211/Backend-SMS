import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../Component/TextInput";
import SelectInput from "../Component/SelectInput";
import FileInput from "../Component/FileInput";

const validationSchema = Yup.object({
  sessionName: Yup.string().required("Session Name is required"),
  hostName: Yup.string().required("Host Name is required"),
  timePeriod: Yup.string().required("Time Period is required"),
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

const WorkshopTrainingFeesForm = () => {
  return (
    <Formik
      initialValues={{
        sessionName: "",
        hostName: "",
        timePeriod: "",
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
          {/* Workshop/Training Details Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Workshop/Training Details
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <TextInput
                label="Session Name"
                name="sessionName"
                placeholder="Enter session here"
              />
              <TextInput
                label="Host Name"
                name="hostName"
                placeholder="Enter host name"
              />
              <TextInput
                label="Time Period"
                name="timePeriod"
                placeholder="Enter duration"
              />
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Payment Details
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <TextInput
                label="Tax (Inc/Exc)"
                name="tax"
                placeholder="Enter tax percentage"
              />
              <TextInput
                label="Discount"
                name="discount"
                placeholder="Enter discount percentage"
              />
              <TextInput
                label="Penalty"
                name="penalty"
                placeholder="Enter penalty amount"
              />
              <TextInput
                label="Total Amount"
                name="totalAmount"
                placeholder="Enter total amount"
              />
              <TextInput
                label="Final amount (After tax/discount/penalty)"
                name="finalAmount"
                placeholder="Enter final amount"
              />
            </div>
          </div>

          {/* Payment Status Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Payment Status
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <SelectInput
                label="Payment Status"
                name="paymentStatus"
                options={["Paid", "Unpaid", "Partial", "Advance"]}
              />
              <TextInput
                label="Paid Amount"
                name="paidAmount"
                placeholder="Enter paid amount"
              />
              <SelectInput
                label="Payment Type"
                name="paymentType"
                options={["Cash", "Card", "Online", "Cheque", "Others"]}
              />
              <TextInput
                label="Advance Amount"
                name="advanceAmount"
                placeholder="Enter advance amount"
              />
              <TextInput
                label="Remaining Amount"
                name="remainingAmount"
                placeholder="Enter remaining amount"
              />
              <TextInput
                label="Cheque Number"
                name="chequeNumber"
                placeholder="Enter cheque number"
              />
              <TextInput
                label="Transaction ID"
                name="transactionId"
                placeholder="Enter transaction ID"
              />
              <FileInput
                label="Add receipt/document"
                name="receipt"
                onChange={(event) =>
                  setFieldValue("receipt", event.target.files[0])
                }
              />
            </div>
          </div>

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

export default WorkshopTrainingFeesForm;
