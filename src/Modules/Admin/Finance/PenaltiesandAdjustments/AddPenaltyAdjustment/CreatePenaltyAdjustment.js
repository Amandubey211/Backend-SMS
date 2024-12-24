import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import SelectInput from "./Components/SelectInput";
import ReturnItems from "./Components/ReturnItems";

const CreatePenaltyAdjustment = () => {
  const initialValues = {
    gracePeriod: "",
    feeCategory: "",
    fixedFee: "",
    penaltyAmount: "",
    maxPenalty: "",
    class: "",
    section: "",
    studentName: "",
    adjustmentType: "",
    reason: "",
    items: [{ category: "", quantity: "", rate: 0, totalAmount: 0 }],
    date: "",
    subAmount: 0,
    discount: 0,
    finalAmount: 0,
    paymentMode: "",
    paymentStatus: "",
    remainingAmount: 0,
    remarks: "",
  };

  const validationSchema = Yup.object().shape({
    gracePeriod: Yup.string().required("Grace Period is required"),
    feeCategory: Yup.string().required("Fee Category is required"),
    penaltyAmount: Yup.number()
      .min(0, "Penalty amount must be positive")
      .required("Penalty Amount is required"),
    class: Yup.string().required("Class is required"),
    section: Yup.string().required("Section is required"),
    studentName: Yup.string().required("Student Name is required"),
    adjustmentType: Yup.string().required("Adjustment Type is required"),
    items: Yup.array().of(
      Yup.object().shape({
        category: Yup.string().required("Category is required"),
        quantity: Yup.number().min(1, "Quantity must be at least 1").required(),
        rate: Yup.number().min(0, "Rate must be positive").required(),
      })
    ),
    date: Yup.string().required("Date is required"),
    subAmount: Yup.number().min(0, "Sub amount must be positive"),
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
          <h1 className="text-2xl font-semibold">Penalties and Adjustments</h1>
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
              Save Penalties
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
              {/* Penalty Rules Configurations */}
              <h2 className="text-lg font-semibold mb-4">
                Penalty Rules Configurations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <TextInput
                  name="gracePeriod"
                  label="Grace Period"
                  placeholder="Enter date"
                />
                <SelectInput
                  name="feeCategory"
                  label="Fee Category"
                  options={["Category 1", "Category 2", "Category 3"]}
                />
                <TextInput
                  name="fixedFee"
                  label="Fixed Fee"
                  placeholder="Enter fixed fee"
                />
                <TextInput
                  name="penaltyAmount"
                  label="Penalty Amount (Eg: 2% Per Day)"
                  placeholder="Enter percentage or amount"
                />
                <TextInput
                  name="maxPenalty"
                  label="Maximum Penalty (If Any)"
                  placeholder="Enter maximum penalty"
                />
              </div>

              {/* Manual Adjustments */}
              <h2 className="text-lg font-semibold mb-4">Manual Adjustments</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <SelectInput
                  name="class"
                  label="Class"
                  options={["Class 1", "Class 2", "Class 3"]}
                />
                <SelectInput
                  name="section"
                  label="Section"
                  options={["Section A", "Section B", "Section C"]}
                />
                <SelectInput
                  name="studentName"
                  label="Student Name"
                  options={["Student 1", "Student 2", "Student 3"]}
                />
                <SelectInput
                  name="adjustmentType"
                  label="Adjustment Type"
                  options={["Adjustment 1", "Adjustment 2"]}
                />
                <TextInput
                  name="reason"
                  label="Reason"
                  placeholder="Enter reason"
                />
              </div>

              {/* Adjustment Details */}
              
              <ReturnItems values={values} setFieldValue={setFieldValue} />

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <TextInput
                  name="date"
                  label="Date"
                  placeholder="Enter date"
                />
                <TextInput
                  name="subAmount"
                  label="Sub Amount"
                  placeholder="Enter sub total"
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
export default CreatePenaltyAdjustment;
