// src/Modules/Admin/Finance/Receipts/AddReceipt/CreatePenaltyAdjustment.js

import React, { useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik"; // Import Field and ErrorMessage
import * as Yup from "yup";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import SelectInput from "./Components/SelectInput";
import ReturnItems from "./Components/ReturnItems";
import { useDispatch, useSelector } from "react-redux";
import { createAdjustment } from "../../../../../Store/Slices/Finance/PenalityandAdjustment/adjustment.thunk";
import { clearSelectedInvoiceNumber } from "../../../../../Store/Slices/Finance/Invoice/invoiceSlice";
import { fetchInvoiceByNumber } from "../../../../../Store/Slices/Finance/Invoice/invoice.thunk";
import { useNavigate } from "react-router-dom";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
import useDebounce from "../../../../../Hooks/CommonHooks/useDebounce";
// import InvoiceTextInput from "./Components/InvoiceTextInput"; // Import the new component
import { calculateFinalAmounts } from "../../../../../Utils/calculateFinalAmounts"; // Adjust the import path as necessary
// import TextInputWithSuffix from "./Components/TextInputWithSuffix";
import FileInput from "./Components/FileInput";

// Define CalculateAmounts component
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
    selectedInvoiceNumber,
    invoiceDetails,
    invoiceFetchSuccess,
  } = useSelector((state) => state.admin.invoices);

  // Debounce the invoice number input by 500ms
  const [invoiceNumberInput, setInvoiceNumberInput] = React.useState("");
  const debouncedInvoiceNumber = useDebounce(invoiceNumberInput, 500);

  // Reference to Formik to set field values outside Formik's render props
  const formikRef = useRef();

  useEffect(() => {
    if (selectedInvoiceNumber) {
      setInvoiceNumberInput(selectedInvoiceNumber);
      if (formikRef.current) {
        formikRef.current.setFieldValue("invoiceNumber", selectedInvoiceNumber);
      }
      // Fetch the invoice details based on selectedInvoiceNumber
      dispatch(fetchInvoiceByNumber(selectedInvoiceNumber));
    }
  }, [selectedInvoiceNumber, dispatch]);

  // Prefill form fields when invoice details are fetched successfully
  useEffect(() => {
    if (invoiceFetchSuccess && invoiceDetails) {
      // Prefill the form fields with invoiceDetails
      formikRef.current.setFieldValue(
        "invoiceNumber",
        invoiceDetails.invoiceNumber
      );
      formikRef.current.setFieldValue("reason", ""); // Set default reason or fetch from invoiceDetails if available
      formikRef.current.setFieldValue(
        "discountType",
        invoiceDetails.discountType || "amount"
      );
      formikRef.current.setFieldValue("discount", invoiceDetails.discount || 0);
      formikRef.current.setFieldValue(
        "adjustmentPenalty",
        invoiceDetails.penalty || 0
      );
      formikRef.current.setFieldValue("tax", invoiceDetails.tax || 0);
      formikRef.current.setFieldValue(
        "items",
        invoiceDetails.lineItems.map((item) => ({
          revenueType: item.revenueType,
          revenueReference: item._id, // Assuming revenueReference is the line item ID
          quantity: item.quantity,
          amount: item.amount,
        }))
      );
      // Clear selectedInvoiceNumber to allow manual entries in future
      dispatch(clearSelectedInvoiceNumber());
    }
  }, [invoiceFetchSuccess, invoiceDetails, dispatch]);

  // Define initial values based on backend requirements
  const initialValues = {
    invoiceNumber: "",
    items: [
      {
        revenueType: "",
        revenueReference: "",
        quantity: null,
        amount: null,
      },
    ],
    reason: "",
    discountType: "amount",
    discount: null,
    adjustmentPenalty: null,
    tax: null,
    subAmount: 0, // Initialize subAmount
    finalAmount: 0, // Initialize finalAmount
    document: null, // Optional
  };

  // Define validation schema
  const validationSchema = Yup.object().shape({
    invoiceNumber: Yup.string().required("Invoice Number is required"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          revenueType: Yup.string().required("Revenue Type is required"),
          revenueReference: Yup.string().required(
            "Revenue Reference is required"
          ),
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
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Prepare the payload as per the backend requirements
    const payload = {
      invoiceNumber: values.invoiceNumber,
      items: values.items.map((item) => ({
        revenueType: item.revenueType,
        revenueReference: item.revenueReference,
        quantity: Number(item.quantity),
        amount: Number(item.amount),
      })),
      reason: values.reason,
      discountType: values.discountType,
      discount: Number(values.discount),
      adjustmentPenalty: Number(values.adjustmentPenalty),
      tax: Number(values.tax),
      finalAmount: Number(values.finalAmount), // Include finalAmount in the payload
    };

    // Dispatch the thunk
    dispatch(createAdjustment(payload))
      .unwrap()
      .then(() => {
        resetForm();
        navigate("/finance/penaltyAdjustment-list"); // Redirect after successful submission
      })
      .catch((err) => {
        // Errors are handled in the slice and toast
        console.error("Error creating adjustment:", err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // Fetch invoice details when debounced invoice number changes and is valid
  useEffect(() => {
    const invoiceNumberPattern = /^INV\d{4}-\d{6}-\d{4}$/; // Adjust regex based on exact format
    if (
      debouncedInvoiceNumber &&
      invoiceNumberPattern.test(debouncedInvoiceNumber)
    ) {
      dispatch(fetchInvoiceByNumber(debouncedInvoiceNumber));
    }
  }, [debouncedInvoiceNumber, dispatch]);

  // Reset form fields when there's an error fetching invoice
  useEffect(() => {
    if (error) {
      formikRef.current.setFieldValue("reason", "");
      formikRef.current.setFieldValue("discountType", "amount");
      formikRef.current.setFieldValue("discount", null);
      formikRef.current.setFieldValue("adjustmentPenalty", null);
      formikRef.current.setFieldValue("tax", null);
      formikRef.current.setFieldValue("subAmount", 0, false);
      formikRef.current.setFieldValue("finalAmount", 0, false);
      formikRef.current.setFieldValue("items", [
        {
          revenueType: "",
          revenueReference: "",
          quantity: null,
          amount: null,
        },
      ]);
    }
  }, [error]);

  return (
    <DashLayout>
      <div className="p-6 min-h-screen">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Create Penalty Adjustment</h1>
        </div>

        {/* Form Section */}
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form id="create-adjustment-form">
              {/* Calculate and update subAmount and finalAmount */}
              <CalculateAmounts />

              {/* Header Buttons */}
              <div className="flex justify-end items-center mb-6">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => formik.resetForm()}
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
                    disabled={formik.isSubmitting || loading}
                  >
                    Save Adjustment
                  </button>
                </div>
              </div>

              {/* Adjustment Details */}
              <h2 className="text-lg font-semibold mb-4">Adjustment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Invoice Number */}
                {/* <InvoiceTextInput
                  name="invoiceNumber"
                  label="Invoice Number"
                  placeholder="Enter invoice number (e.g., INV0003-202412-0001)"
                  type="text"
                  value={invoiceNumberInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInvoiceNumberInput(value);
                    formik.setFieldValue("invoiceNumber", value);

                    // Reset form fields if invoice number changes
                    if (value !== selectedInvoiceNumber) {
                      formik.setFieldValue("reason", "");
                      formik.setFieldValue("discountType", "amount");
                      formik.setFieldValue("discount", null);
                      formik.setFieldValue("adjustmentPenalty", null);
                      formik.setFieldValue("tax", null);
                      formik.setFieldValue("subAmount", 0, false);
                      formik.setFieldValue("finalAmount", 0, false);
                      formik.setFieldValue("items", [
                        {
                          revenueType: "",
                          revenueReference: "",
                          quantity: null,
                          amount: null,
                        },
                      ]);
                    }
                  }}
                  onBlur={() => {
                    // Ensure tax is within 0-100 on blur
                    const taxValue = formik.values.tax;
                    if (taxValue > 100) {
                      formik.setFieldValue("tax", 100);
                    } else if (taxValue < 0) {
                      formik.setFieldValue("tax", 0);
                    }

                    // Dispatch fetchInvoiceByNumber on blur
                    dispatch(fetchInvoiceByNumber(invoiceNumberInput));
                  }}
                  required
                /> */}

                {/* Reason */}
                <TextInput
                  name="reason"
                  label="Reason"
                  placeholder="Enter reason for adjustment"
                  required
                  type="text"
                />
              </div>

              {/* Items Section */}
              <h2 className="text-lg font-semibold mb-4">Adjustment Items</h2>
              <ReturnItems
                values={formik.values}
                setFieldValue={formik.setFieldValue}
                required
              />

              {/* Sub Amount and Final Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                />

                {/* Discount */}
                <TextInput
                  name="discount"
                  label="Discount"
                  placeholder="Enter discount value"
                  required
                  type="number"
                />

                {/* Adjustment Penalty */}
                <TextInput
                  name="adjustmentPenalty"
                  label="Adjustment Penalty"
                  placeholder="Enter penalty amount"
                  required
                  type="number"
                />

                {/* Tax */}
                {/* <TextInputWithSuffix
                  name="tax"
                  label="Tax"
                  placeholder="Enter tax value"
                  required
                  type="number"
                  suffix="%"
                /> */}

                {/* Document Upload Field */}
                <FileInput
                  name="document"
                  label="Upload Document (Optional)"
                  onChange={(e) => {
                    const fileUrl = e.target.value; // Cloudinary URL after upload
                    formik.setFieldValue("document", fileUrl); // Update Formik's value
                  }}
                  value={formik.values.document} // Bind Formik's value
                />

                {/* Sub Amount (Read-only) */}
                <TextInput
                  name="subAmount"
                  label="Sub Amount"
                  placeholder="Sub Amount"
                  type="number"
                  disabled
                />

                {/* Final Amount (Read-only) */}
                <TextInput
                  name="finalAmount"
                  label="Final Amount"
                  placeholder="Final Amount"
                  type="number"
                  disabled
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
  );
};

export default CreatePenaltyAdjustment;
