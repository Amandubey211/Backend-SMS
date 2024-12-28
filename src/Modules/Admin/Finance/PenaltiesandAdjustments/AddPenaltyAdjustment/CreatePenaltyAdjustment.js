// src/Modules/Admin/Finance/PenaltiesandAdjustments/AddPenaltyAdjustment/CreatePenaltyAdjustment.js

import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import SelectInput from "./Components/SelectInput";
import ReturnItems from "./Components/ReturnItems";
import FileInput from "./Components/FileInput";
import { useDispatch, useSelector } from "react-redux";
import { createAdjustment } from "../../../../../Store/Slices/Finance/PenalityandAdjustment/adjustment.thunk";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePenaltyAdjustment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Corrected useSelector path
  const { loading, error, successMessage } = useSelector((state) => state.admin.penaltyAdjustment);

  // Define initial values based on backend requirements
  const initialValues = {
    invoiceNumber: "",
    items: [
      {
        revenueType: "",
        revenueReference: "",
        quantity: "",
        amount: "",
      },
    ],
    reason: "",
    discountType: "",
    discount: "",
    adjustmentPenalty: "",
    tax: "",
    document: null, // Optional
  };
  
  // Define validation schema
  const validationSchema = Yup.object().shape({
    invoiceNumber: Yup.string().required("Invoice Number is required"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          revenueType: Yup.string().required("Revenue Type is required"),
          revenueReference: Yup.string().required("Revenue Reference is required"),
          quantity: Yup.number()
            .min(1, "Quantity must be at least 1")
            .required("Quantity is required"),
          amount: Yup.number()
            .min(0, "Amount must be positive")
            .required("Amount is required"),
        })
      )
      .min(1, "At least one item is required"),
    reason: Yup.string()
      .max(255, "Reason cannot exceed 255 characters")
      .required("Reason is required"),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"], "Invalid Discount Type")
      .required("Discount Type is required"),
    discount: Yup.number()
      .min(0, "Discount cannot be negative")
      .required("Discount is required"),
    adjustmentPenalty: Yup.number()
      .min(0, "Penalty cannot be negative")
      .required("Adjustment Penalty is required"),
    tax: Yup.number()
      .min(0, "Tax cannot be negative")
      .required("Tax is required"),
  });

  // Handle form submission
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Prepare the payload as per the backend requirements
    const payload = {
      invoiceNumber: values.invoiceNumber,
      items: values.items,
      reason: values.reason,
      discountType: values.discountType,
      discount: values.discount,
      adjustmentPenalty: values.adjustmentPenalty,
      tax: values.tax,
      document: values.document, // Optional
    };

    // Dispatch the thunk
    dispatch(createAdjustment(payload))
      .unwrap()
      .then(() => {
        resetForm();
        toast.success("Adjustment created successfully!");
        navigate("/finance/penaltyAdjustment-list"); // Navigate to adjustments list page
      })
      .catch((err) => {
        // Errors are handled in the slice and toast
        console.error("Error creating adjustment:", err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <DashLayout>
      <div className="p-6 min-h-screen">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Create Penalty Adjustment</h1>
        </div>

        {/* Form Section */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting, resetForm }) => (
            <Form id="create-adjustment-form">
              {/* Header Buttons */}
              <div className="flex justify-end items-center mb-6">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      toast.success("Form has been reset.");
                    }}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-white"
                    style={{
                      background: "linear-gradient(to right, #ec4899, #a855f7)", // from-pink-500 to-purple-500
                    }}
                    disabled={isSubmitting || loading}
                  >
                    Save Adjustment
                  </button>
                </div>
              </div>

              {/* Adjustment Details */}
              <h2 className="text-lg font-semibold mb-4">Adjustment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Invoice Number */}
                <TextInput
                  name="invoiceNumber"
                  label="Invoice Number *"
                  placeholder="Enter invoice number"
                  required
                  type="text"
                />

                {/* Reason */}
                <TextInput
                  name="reason"
                  label="Reason *"
                  placeholder="Enter reason for adjustment"
                  required
                  type="text"
                />

                {/* Discount Type */}
                <SelectInput
                  name="discountType"
                  label="Discount Type *"
                  options={[
                    { value: "percentage", label: "Percentage" },
                    { value: "amount", label: "Amount" },
                  ]}
                  placeholder="Select Discount Type"
                  required
                />

                {/* Discount */}
                <TextInput
                  name="discount"
                  label="Discount *"
                  placeholder="Enter discount value"
                  required
                  type="number"
                />

                {/* Adjustment Penalty */}
                <TextInput
                  name="adjustmentPenalty"
                  label="Adjustment Penalty *"
                  placeholder="Enter penalty amount"
                  required
                  type="number"
                />

                {/* Tax */}
                <TextInput
                  name="tax"
                  label="Tax *"
                  placeholder="Enter tax percentage"
                  required
                  type="number"
                />
              </div>

              {/* Items Section */}
              <h2 className="text-lg font-semibold mb-4">Adjustment Items</h2>
              <ReturnItems
                values={values}
                setFieldValue={setFieldValue}
                required
              />

              {/* Document Upload (Optional) */}
              {/* <div className="mb-6">
                <FileInput
                  name="document"
                  label="Add Document (if any)"
                  placeholder="Upload file"
                  onChange={(e) => {
                    setFieldValue("document", e.currentTarget.files[0]);
                  }}
                  disabled={isSubmitting || loading}
                />
              </div> */}

              {/* Display Success and Error Messages */}
              {successMessage && (
                <div className="text-green-500 mb-4">{successMessage}</div>
              )}
              {error && (
                <div className="text-red-500 mb-4">{error}</div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </DashLayout>
  );
};

export default CreatePenaltyAdjustment;
