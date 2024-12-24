import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import SelectInput from "./Components/SelectInput";
import ReturnItems from "./Components/ReturnItems";
import FileInput from "./Components/FileInput";

const CreateReceipt = () => {
  const initialValues = {
    notes: "",
    class: "",
    section: "",
    studentName: "",
    admissionNumber: "",
    parentName: "",
    address: "",
    contactNumber: "",
    mailId: "",
    academicYear: "",
    items: [{ category: "", quantity: 1, rate: 0, totalAmount: 0 }],
    billingPeriod: "",
    dueDate: "",
    subAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    governmentRefNumber: "",
    document: null,
    paymentMode: "",
    paymentStatus: "",
    remainingAmount: 0,
    remarks: "",
  };

  const validationSchema = Yup.object().shape({
    studentName: Yup.string().required("Student Name is required"),
    class: Yup.string().required("Class is required"),
    section: Yup.string().required("Section is required"),
    admissionNumber: Yup.string().required("Admission Number is required"),
    parentName: Yup.string().required("Parent Name is required"),
    contactNumber: Yup.string().required("Contact Number is required"),
    mailId: Yup.string().email("Invalid email").required("Mail ID is required"),
    academicYear: Yup.string().required("Academic Year is required"),
    items: Yup.array().of(
      Yup.object().shape({
        category: Yup.string().required("Category is required"),
        quantity: Yup.number().min(1, "Quantity must be at least 1"),
        rate: Yup.number().min(0, "Rate must be positive"),
      })
    ),
    dueDate: Yup.string().required("Due Date is required"),
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
          <h1 className="text-2xl font-semibold">Create Receipts</h1>
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
              {/* Notes Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <TextInput
                  name="notes"
                  label="Notes"
                  placeholder="Write notes here"
                />
              </div>

              {/* Bill To Section */}
              <h2 className="text-lg font-semibold mb-4">Bill To</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <SelectInput
                  name="class"
                  label="Class"
                  options={["Class 1", "Class 2"]}
                />
                <SelectInput
                  name="section"
                  label="Section"
                  options={["Section A", "Section B"]}
                />
                <SelectInput
                  name="studentName"
                  label="Student Name"
                  options={["Student 1", "Student 2"]}
                />
                <TextInput
                  name="admissionNumber"
                  label="Admission Number"
                  placeholder="Enter admission number"
                />
                <TextInput
                  name="parentName"
                  label="Parent Name"
                  placeholder="Enter parent name"
                />
                <TextInput
                  name="address"
                  label="Address"
                  placeholder="Enter address"
                />
                <TextInput
                  name="contactNumber"
                  label="Contact Number"
                  placeholder="Enter contact number"
                />
                <TextInput
                  name="mailId"
                  label="Mail ID"
                  placeholder="Enter mail ID"
                />
                <SelectInput
                  name="academicYear"
                  label="Academic Year"
                  options={["2023", "2024"]}
                />
              </div>

              {/* Return Items */}
              <ReturnItems values={values} setFieldValue={setFieldValue} />

              {/* Payment Details */}
              <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <SelectInput
                  name="billingPeriod"
                  label="Billing Period"
                  options={["Monthly", "Quarterly", "Yearly"]}
                />
                <TextInput
                  name="dueDate"
                  label="Due Date"
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
                  name="penalty"
                  label="Penalty"
                  placeholder="Enter penalty amount"
                />
                <TextInput
                  name="finalAmount"
                  label="Final Amount (After tax/discount/penalty)"
                  placeholder="Enter final amount"
                  readOnly
                />
                <TextInput
                  name="governmentRefNumber"
                  label="Government Refer Number"
                  placeholder="Enter here"
                />
                <FileInput
                  name="document"
                  label="Add Document (if any)"
                  placeholder="Upload file"
                />
              </div>

              {/* Payment Status */}
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

export default CreateReceipt;
