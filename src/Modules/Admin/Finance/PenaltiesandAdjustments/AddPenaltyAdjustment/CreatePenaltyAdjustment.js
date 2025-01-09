// src/Modules/Admin/Finance/Receipts/AddReceipt/CreatePenaltyAdjustment.js

import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, FieldArray, useFormikContext } from "formik"; // Import FieldArray if needed
import * as Yup from "yup";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import SelectInput from "./Components/SelectInput";
import FileInput from "./Components/FileInput";
import { useDispatch, useSelector } from "react-redux";
import { createAdjustment } from "../../../../../Store/Slices/Finance/PenalityandAdjustment/adjustment.thunk";
import { clearSelectedAdjustment, setReadOnly } from "../../../../../Store/Slices/Finance/PenalityandAdjustment/adjustment.slice";
import toast from "react-hot-toast";
import Layout from "../../../../../Components/Common/Layout";
import { useNavigate } from "react-router-dom";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
import useDebounce from "../../../../../Hooks/CommonHooks/useDebounce";
import InvoiceTextInput from "./Components/InvoiceTextInput"; // Import the new component
import { calculateFinalAmounts } from "../../../../../Utils/calculateFinalAmounts"; // Adjust the import path as necessary
import TextInputWithSuffix from "./Components/TextInputWithSuffix";
import { fetchInvoiceByNumber } from "../../../../../Store/Slices/Finance/Invoice/invoice.thunk";

const CalculateAmounts = () => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    // Calculate total_amount from items
    const total_amount = values.items.reduce(
      (acc, item) => acc + Number(item.amount || 0),
      0
    );

    const calculated = calculateFinalAmounts({
      total_amount,
      discountType: values.discountType,
      discount: Number(values.discount),
      tax: Number(values.tax),
      penalty: Number(values.adjustmentPenalty),
      paid_amount: 0, // Assuming no paid amount
      advance_amount: 0, // Assuming no advance amount
    });

    // Update Formik's subAmount and finalAmount
    setFieldValue("subAmount", calculated.discountValue, false);
    setFieldValue("finalAmount", calculated.finalAmount, false);
  }, [
    values.items,
    values.discountType,
    values.discount,
    values.tax,
    values.adjustmentPenalty,
    setFieldValue,
  ]);

  return null; // This component doesn't render anything
};

const CreatePenaltyAdjustment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useNavHeading("Finance", "Create Penalty & Adjustment");

  // Extract necessary state from Redux
  const {
    loading,
    error,
    successMessage,
    readOnly,
    selectedAdjustment,
  } = useSelector((state) => state.admin.penaltyAdjustment);

  // Reference to Formik to set field values outside Formik's render props
  const formikRef = useRef();

  // Clear selected adjustment on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearSelectedAdjustment());
    };
  }, [dispatch]);

  // Define initial values based on whether in read-only mode or creating new
  const initialValues = readOnly && selectedAdjustment ? {
    invoiceNumber: selectedAdjustment.invoiceId?.invoiceNumber || "",
    items: selectedAdjustment.items || [
      {
        revenueType: "",
        revenueReference: "",
        quantity: 1,
        amount: 0,
      },
    ],
    reason: selectedAdjustment.reason || "",
    discountType: selectedAdjustment.discountType || "amount",
    discount: selectedAdjustment.discount || 0,
    adjustmentPenalty: selectedAdjustment.adjustmentPenalty || 0,
    tax: selectedAdjustment.tax || 0,
    subAmount: selectedAdjustment.subAmount || 0,
    finalAmount: selectedAdjustment.finalAmount || 0,
    document: selectedAdjustment.document || null,
  } : {
    invoiceNumber: "",
    items: [
      {
        revenueType: "",
        revenueReference: "",
        quantity: 1,
        amount: 0,
      },
    ],
    reason: "",
    discountType: "amount",
    discount: 0,
    adjustmentPenalty: 0,
    tax: 0,
    subAmount: 0,
    finalAmount: 0,
    document: null,
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
      .min(0, "Tax cannot be less than 0")
      .max(100, "Tax cannot exceed 100")
      .required("Tax is required"),
    subAmount: Yup.number().min(0).notRequired(),
    finalAmount: Yup.number().min(0).notRequired(),
    document: Yup.string().nullable(),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (readOnly) return; // Prevent submission in read-only mode
    dispatch(setReadOnly(false)); // Reset readOnly if needed
    setSubmitting(true);
    try {
      await dispatch(createAdjustment(values)).unwrap(); // Unwraps the promise to catch errors more effectively
      toast.success("Penalty & Adjustment created successfully!");
      resetForm(); // Resets the form to initial values
      navigate("/finance/penaltyAdjustment-list"); // Redirect after successful submission
    } catch (error) {
      toast.error(error || "Failed to create penalty & adjustment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <DashLayout>
        <div className="p-6 min-h-screen">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              {readOnly ? "View Penalty & Adjustment" : "Create Penalty & Adjustment"}
            </h1>
            {readOnly && (
              <button
                type="button"
                onClick={() => dispatch(setReadOnly(false))}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Edit
              </button>
            )}
          </div>

          {/* Read-Only Mode Alert */}
          {readOnly && selectedAdjustment && (
            <div className="bg-yellow-100 text-yellow-900 px-4 py-2 rounded-md mb-4">
              Currently in read-only mode. You cannot edit these fields.
            </div>
          )}

          {/* Form Section */}
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={readOnly ? null : validationSchema} // Disable validation in read-only
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, resetForm, isSubmitting }) => (
              <Form id="create-adjustment-form">
                {/* Calculate and update subAmount and finalAmount */}
                <CalculateAmounts />

                {/* Header Buttons */}
                {!readOnly && (
                  <div className="flex justify-end items-center mb-6 gap-4">
                    <button
                      type="button"
                      onClick={() => resetForm()}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || loading}
                      className="px-4 py-2 rounded-md text-white"
                      style={{
                        background: "linear-gradient(to right, #ec4899, #a855f7)", // from-pink-500 to-purple-500
                      }}
                    >
                      {isSubmitting || loading ? 'Loading..' : 'Save Adjustment'}
                    </button>
                  </div>
                )}

                {/* Adjustment Details */}
                <h2 className="text-lg font-semibold mb-4">Adjustment Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Invoice Number */}
                  <InvoiceTextInput
                    name="invoiceNumber"
                    label="Invoice Number"
                    placeholder="Enter invoice number (e.g., INV0003-202412-0001)"
                    type="text"
                    value={values.invoiceNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue("invoiceNumber", value);

                      // Dispatch fetchInvoiceByNumber
                      if (value.trim() !== "") {
                        dispatch(fetchInvoiceByNumber(value.trim()));
                      }
                    }}
                    required
                    readOnly={readOnly}
                    disabled={readOnly}
                  />

                  {/* Reason */}
                  <TextInput
                    name="reason"
                    label="Reason"
                    placeholder="Enter reason for adjustment"
                    required
                    type="text"
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                </div>

                {/* Adjustment Items Section */}
                <h2 className="text-lg font-semibold mb-4">Adjustment Items</h2>
                <FieldArray name="items">
                  {({ remove, push }) => (
                    <>
                      {values.items.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-8 items-center mb-6"
                        >
                          <div className="col-span-3">
                            <SelectInput
                              name={`items.${index}.revenueType`}
                              label="Revenue Type"
                              options={[
                                "studentFee",
                                "FacilityRevenue",
                                "service_based_revenue",
                                "community_externalaffair_revenue",
                                "financial_investment_revenue",
                                "Penalties",
                                "Other",
                              ]}
                              readOnly={readOnly}
                              disabled={readOnly}
                            />
                          </div>

                          <div className="col-span-3">
                            <TextInput
                              name={`items.${index}.quantity`}
                              label="Quantity"
                              type="number"
                              placeholder="Enter Quantity"
                              readOnly={readOnly}
                              disabled={readOnly}
                            />
                          </div>

                          <div className="col-span-3">
                            <TextInput
                              name={`items.${index}.amount`}
                              label="Amount *"
                              type="number"
                              placeholder="Enter Amount"
                              readOnly={readOnly}
                              disabled={readOnly}
                            />
                          </div>

                          <div className="col-span-3 flex items-center justify-center">
                            {!readOnly && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700 text-xl"
                              >
                                ✖
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {!readOnly && (
                        <div className="flex flex-col justify-center items-center mt-6">
                          <button
                            type="button"
                            onClick={() =>
                              push({ revenueType: "", revenueReference: "", quantity: 1, amount: 0 })
                            }
                            className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
                            style={{
                              background: "linear-gradient(to right, #ec4899, #a855f7)",
                            }}
                          >
                            <span className="text-white text-2xl">+</span>
                          </button>
                          <span className="text-gray-600 text-sm mt-2">Add Item</span>
                        </div>
                      )}
                    </>
                  )}
                </FieldArray>

                {/* Additional Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Due Date */}
                  <TextInput
                    name="dueDate"
                    label="Due Date"
                    placeholder="Enter Due Date"
                    type="date"
                    readOnly={readOnly}
                    disabled={readOnly}
                  />

                  {/* Sub Amount */}
                  <TextInput
                    name="subAmount"
                    label="Sub Amount"
                    placeholder="Sub Amount"
                    type="number"
                    readOnly
                    disabled
                  />

                  {/* Tax */}
                  <TextInputWithSuffix
                    name="tax"
                    label="Tax"
                    placeholder="Enter tax value"
                    required
                    type="number"
                    suffix="%"
                    readOnly={readOnly}
                    disabled={readOnly}
                  />

                  {/* Discount Type */}
                  <SelectInput
                    name="discountType"
                    label="Discount Type"
                    options={[
                      { value: "percentage", label: "Percentage" },
                      { value: "amount", label: "Amount" },
                    ]}
                    placeholder="Select Discount Type"
                    required
                    readOnly={readOnly}
                    disabled={readOnly}
                  />

                  {/* Discount */}
                  <TextInput
                    name="discount"
                    label={`Discount (${values.discountType === "percentage" ? "%" : "Amount"})`}
                    placeholder={`Enter discount ${values.discountType}`}
                    type="number"
                    readOnly={readOnly}
                    disabled={readOnly}
                  />

                  {/* Adjustment Penalty */}
                  <TextInput
                    name="adjustmentPenalty"
                    label="Adjustment Penalty"
                    placeholder="Enter penalty amount"
                    required
                    type="number"
                    readOnly={readOnly}
                    disabled={readOnly}
                  />

                  {/* Final Amount */}
                  <TextInput
                    name="finalAmount"
                    label="Final Amount (After tax/discount)"
                    placeholder="Final Amount"
                    type="number"
                    readOnly
                    disabled
                  />

                  {/* Document Upload Field */}
                  <FileInput
                    name="document"
                    label="Upload Document (Optional)"
                    onChange={(e) => {
                      const fileUrl = e.target.value; // Cloudinary URL after upload
                      setFieldValue("document", fileUrl); // Update Formik's value
                    }}
                    value={values.document} // Bind Formik's value
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                </div>

                {/* Display Success and Error Messages */}
                {successMessage && (
                  <div className="text-green-500 mb-4">{successMessage}</div>
                )}
                {error && <div className="text-red-500 mb-4">{error}</div>}
              </Form>
            )}
          </Formik>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default CreatePenaltyAdjustment;
