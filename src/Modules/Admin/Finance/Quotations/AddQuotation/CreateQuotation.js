import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import SelectInput from "./Components/SelectInput";
import ReturnItems from "./Components/ReturnItems";
import FileInput from "./Components/FileInput";

const CreateQuotation = () => {
  const initialValues = {
    contactNumberFrom: "",
    mailIdFrom: "",
    notes: "",
    vendorName: "",
    addressTo: "",
    contactNumberTo: "",
    mailIdTo: "",
    purpose: "",
    items: [{ category: "", quantity: "", rate: 0, totalAmount: 0 }],
    validityPeriod: "",
    quotationDate: "",
    subAmount: 0,
    tax: 0,
    discount: 0,
    finalAmount: 0,
    document: null,
    paymentMode: "",
    paymentStatus: "",
    remainingAmount: 0,
    remarks: "",
  };

  const validationSchema = Yup.object().shape({
    contactNumberFrom: Yup.string().required("Contact Number is required"),
    mailIdFrom: Yup.string().email("Invalid email").required("Mail ID is required"),
    vendorName: Yup.string().required("Vendor/Organisation Name is required"),
    addressTo: Yup.string().required("Address is required"),
    contactNumberTo: Yup.string().required("Contact Number is required"),
    mailIdTo: Yup.string().email("Invalid email").required("Mail ID is required"),
    purpose: Yup.string().required("Purpose is required"),
    items: Yup.array().of(
      Yup.object().shape({
        category: Yup.string().required("Category is required"),
        quantity: Yup.number().min(1, "Quantity must be at least 1").required(),
        rate: Yup.number().min(0, "Rate must be positive").required(),
      })
    ),
    validityPeriod: Yup.string().required("Validity Period is required"),
    quotationDate: Yup.string().required("Quotation Date is required"),
    finalAmount: Yup.number().min(0, "Final amount must be positive"),
    remainingAmount: Yup.number().min(0, "Remaining amount must be positive"),
  });

  const handleSubmit = (values) => {
    console.log("Form Submitted", values);
  };

  return (
    <DashLayout>
      <div className="p-6 min-h-screen">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Create Quotation</h1>
          <div className="flex gap-4">
            <button
              type="reset"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Reset
            </button>
            <button
              type="button"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Preview
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-white"
              style={{
                background: "linear-gradient(to right, #ec4899, #a855f7)", // from-pink-500 to-purple-500
              }}
            >
              Save Receipts
            </button>
          </div>
        </div>

        {/* Form Section */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              {/* Quotation From Section */}
              <h2 className="text-lg font-semibold mb-4">Quotation From</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <TextInput
                  name="contactNumberFrom"
                  label="Contact Number"
                  placeholder="Enter contact number"
                />
                <TextInput
                  name="mailIdFrom"
                  label="Mail ID"
                  placeholder="Enter mail ID"
                />
                <TextInput
                  name="notes"
                  label="Notes"
                  placeholder="Write notes here"
                />
              </div>

              {/* Quotation To Section */}
              <h2 className="text-lg font-semibold mb-4">Quotation To</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <TextInput
                  name="vendorName"
                  label="Vendor/Organisation Name"
                  placeholder="Enter name"
                />
                <TextInput
                  name="addressTo"
                  label="Address"
                  placeholder="Enter invoice number"
                />
                <TextInput
                  name="contactNumberTo"
                  label="Contact Number"
                  placeholder="Enter contact number"
                />
                <TextInput
                  name="mailIdTo"
                  label="Mail ID"
                  placeholder="Enter mail ID"
                />
                <SelectInput
                  name="purpose"
                  label="Purpose"
                  options={["Purpose 1", "Purpose 2", "Purpose 3"]}
                />
              </div>

              {/* Quotation Details Section */}
              <h2 className="text-lg font-semibold mb-4">Quotation Details</h2>
              <ReturnItems values={values} setFieldValue={setFieldValue} />

              {/* Additional Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <SelectInput
                  name="validityPeriod"
                  label="Validity Period"
                  options={["1 Month", "3 Months", "6 Months"]}
                />
                <TextInput
                  name="quotationDate"
                  label="Quotation Date"
                  placeholder="Enter date and time"
                />
                <TextInput
                  name="subAmount"
                  label="Sub Amount"
                  placeholder="Enter sub total"
                />
                <TextInput
                  name="tax"
                  label="Tax (Inc/Exc)"
                  placeholder="Enter tax percentage"
                />
                <TextInput
                  name="discount"
                  label="Discount"
                  placeholder="Enter discount"
                />
                <TextInput
                  name="finalAmount"
                  label="Final Amount (After tax/discount)"
                  placeholder="Enter final amount"
                  readOnly
                />
                <FileInput
                  name="document"
                  label="Add Document (if any)"
                  placeholder="Upload file"
                />
              </div>

              {/* Payment Status Section */}
              <h2 className="text-lg font-semibold mb-4">Payment Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectInput
                  name="paymentMode"
                  label="Payment Mode"
                  options={["Cash", "Card", "Bank Transfer"]}
                />
                <SelectInput
                  name="paymentStatus"
                  label="Payment Status"
                  options={["Paid", "Unpaid", "Partial"]}
                />
                <TextInput
                  name="remainingAmount"
                  label="Remaining Amount"
                  placeholder="Enter remaining amount"
                />
                <TextInput
                  name="remarks"
                  label="Remarks (If Any)"
                  placeholder="Enter remarks here"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </DashLayout>
  );
};

export default CreateQuotation;
