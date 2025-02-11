// src/Modules/Admin/Finance/Receipts/AddReceipt/CreatePenaltyAdjustment.js

import React, { useState, useEffect, useRef } from "react";
import {
  Formik,
  Form,
  FieldArray,
  Field,
  ErrorMessage,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import SelectInput from "./Components/SelectInput";
import FileInput from "./Components/FileInput";
import { useDispatch, useSelector } from "react-redux";
import { createAdjustment } from "../../../../../Store/Slices/Finance/PenalityandAdjustment/adjustment.thunk";
import {
  clearSelectedAdjustment,
  setReadOnly,
  setSelectedAdjustment,
} from "../../../../../Store/Slices/Finance/PenalityandAdjustment/adjustment.slice";
import toast from "react-hot-toast";
import Layout from "../../../../../Components/Common/Layout";
import { useNavigate } from "react-router-dom";
import InvoiceTextInput from "./Components/InvoiceTextInput";
import { calculateFinalAmounts } from "../../../../../Utils/calculateFinalAmounts";
import TextInputWithSuffix from "./Components/TextInputWithSuffix";
import {
  clearInvoiceFetchSuccess,
  clearSelectedInvoiceNumber,
  setSelectedInvoiceNumber,
} from "../../../../../Store/Slices/Finance/Invoice/invoiceSlice";
import { fetchInvoiceByNumber } from "../../../../../Store/Slices/Finance/Invoice/invoice.thunk";

const CalculateAmounts = () => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (!Array.isArray(values.items)) {
      setFieldValue("subAmount", 0, false);
      setFieldValue("finalAmount", 0, false);
      return;
    }

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
  const formikRef = useRef();


  const selectedInvoiceNumber = useSelector(
    (state) => state.admin.invoices.selectedInvoiceNumber
  );


  // Extract necessary state from Redux
  const {
    loading,
    error,
    successMessage,
    readOnly,
    selectedAdjustment,
  } = useSelector((state) => state.admin.penaltyAdjustment);



  // Local state to track API errors
  const [invoiceError, setInvoiceError] = useState(false);

  // Define initial values based on whether in read-only mode or creating new
  const prefilledValues =
    readOnly && selectedAdjustment
      ? {
        invoiceNumber: selectedAdjustment.invoiceId?.invoiceNumber || "",
        items:
          Array.isArray(selectedAdjustment.items) &&
            selectedAdjustment.items.length > 0
            ? selectedAdjustment.items.map((item) => ({
              revenueType: item.revenueType || "",
              revenueReference: item._id || "", // **Set to `_id` from lineItems**
              quantity: item.quantity || 1,
              amount: item.amount || 0,
            }))
            : [
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
        document: selectedAdjustment.document || null, // **Retain document in read-only mode**
      }
      : {
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
        document: null, // **Initial value for create mode**
      };

  const initialValues = prefilledValues;


  useEffect(() => {
    const fetchAndPrefill = async () => {
      if (selectedInvoiceNumber) {
        try {
          await dispatch(fetchInvoiceByNumber(selectedInvoiceNumber)).unwrap();
          formikRef.current.setFieldValue("invoiceNumber", selectedInvoiceNumber);
          dispatch(clearSelectedInvoiceNumber());
        } catch (error) {
          console.error("Failed to fetch invoice:", error);
        }
      }
    };

    fetchAndPrefill();
  }, [selectedInvoiceNumber, dispatch]);




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
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (readOnly) {
      // Prevent submission in read-only mode
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    try {
      // Prepare the payload
      const payload = {
        invoiceNumber: values.invoiceNumber,
        items: values.items.map((item) => ({
          revenueType: item.revenueType,
          revenueReference: item.revenueReference, // **This is the `_id` from lineItems**
          quantity: item.quantity,
          amount: item.amount,
        })),
        reason: values.reason,
        discountType: values.discountType,
        discount: values.discount,
        adjustmentPenalty: values.adjustmentPenalty,
        tax: values.tax,
        subAmount: values.subAmount,
        finalAmount: values.finalAmount,
      };

      // Include 'document' only if it exists
      if (values.document) {
        payload.document = values.document;
      }

      await dispatch(createAdjustment(payload)).unwrap();
      // toast.success("Penalty & Adjustment created successfully!");
      resetForm();
      navigate("/finance/penaltyAdjustment-list"); // **Ensure this path is correct**
    } catch (err) {
      // toast.error(err || "Failed to create penalty & adjustment.");
      console.log(err || "Failed to create penalty & adjustment.");
    } finally {
      setSubmitting(false);
    }
  };

  // Extract invoice state from Redux
  const { invoiceDetails, invoiceFetchSuccess, error: invoiceErrorMsg } = useSelector(
    (state) => state.admin.invoices || {}
  );


  // Implementing Debounce to prevent excessive API calls
  const debounceRef = useRef(null);

  // Fetch invoice details when selectedInvoiceNumber changes
  useEffect(() => {
    if (readOnly) return; // Do not fetch if in read-only mode

    const invoiceNumberPattern = /^INV\d{4}-\d{6}-\d{4}$/; // Adjust regex based on exact format

    if (
      selectedInvoiceNumber &&
      invoiceNumberPattern.test(selectedInvoiceNumber)
    ) {
      // Clear existing debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Set new debounce
      debounceRef.current = setTimeout(() => {
        dispatch(fetchInvoiceByNumber(selectedInvoiceNumber));
      }, 500); // 500ms delay
    } else if (!selectedInvoiceNumber) {
      // Clear fetched invoice data if invoice number is empty
      dispatch(clearSelectedInvoiceNumber());
      dispatch(clearInvoiceFetchSuccess());
    }

    // Cleanup on unmount
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [selectedInvoiceNumber, dispatch, readOnly]);

  // Handle Prefill when invoice details are fetched successfully
  useEffect(() => {
    if (invoiceFetchSuccess && invoiceDetails && !readOnly) {
      // Prefill form fields based on fetched invoice details
      formikRef.current.setFieldValue("reason", invoiceDetails.description || "", false);

      // Map lineItems from API to items in the form
      if (Array.isArray(invoiceDetails.lineItems)) {
        const mappedItems = invoiceDetails.lineItems.map((item) => ({
          revenueType: item.revenueType || "",
          revenueReference: item._id || "", // **Set to `_id` from lineItems**
          quantity: item.quantity || 1,
          amount: item.amount || 0,
        }));
        formikRef.current.setFieldValue("items", mappedItems, false);
      }

      // Map other fields as needed
      formikRef.current.setFieldValue("discountType", invoiceDetails.discountType || "amount", false);
      formikRef.current.setFieldValue("discount", invoiceDetails.discount || 0, false);
      formikRef.current.setFieldValue("adjustmentPenalty", invoiceDetails.penalty || 0, false);
      formikRef.current.setFieldValue("tax", invoiceDetails.tax || 0, false);
      formikRef.current.setFieldValue("subAmount", invoiceDetails.subAmount || 0, false);
      formikRef.current.setFieldValue("finalAmount", invoiceDetails.finalAmount || 0, false);
      // **Removed:** Prevent pre-filling 'document'
      // formikRef.current.setFieldValue("document", invoiceDetails.qrCode || null, false);

      setInvoiceError(false); // Reset error state on successful fetch
      dispatch(clearSelectedInvoiceNumber());
      dispatch(clearInvoiceFetchSuccess());
    }
  }, [invoiceFetchSuccess, invoiceDetails, readOnly, dispatch]);

  // Handle API errors (e.g., invoice not found)
  useEffect(() => {
    if (invoiceErrorMsg && !readOnly) {
      setInvoiceError(true);
      if (formikRef.current) {
        // Clear all fields except invoiceNumber
        const currentValues = formikRef.current.values;
        formikRef.current.setValues({
          invoiceNumber: currentValues.invoiceNumber, // Retain invoiceNumber
          items: [
            {
              revenueType: "",
              revenueReference: "", // **Set to empty since we don't have valid IDs**
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
          // **Removed:** Do not reset 'document'
        });
      }
      dispatch(clearSelectedAdjustment());
    } else {
      setInvoiceError(false);
    }
  }, [invoiceErrorMsg, readOnly, dispatch]);

  // Ensure subAmount and finalAmount are correctly calculated in read-only mode
  useEffect(() => {
    if (readOnly && selectedAdjustment) {
      const lineItems = selectedAdjustment.items || [];
      const total_amount = lineItems.reduce(
        (acc, item) => acc + Number(item.amount || 0),
        0
      );

      const calculated = calculateFinalAmounts({
        total_amount,
        discountType: selectedAdjustment.discountType,
        discount: Number(selectedAdjustment.discount),
        tax: Number(selectedAdjustment.tax),
        penalty: Number(selectedAdjustment.adjustmentPenalty),
        paid_amount: 0,
        advance_amount: 0,
      });

      if (formikRef.current) {
        formikRef.current.setFieldValue("subAmount", calculated.discountValue, false);
        formikRef.current.setFieldValue("finalAmount", calculated.finalAmount, false);
      }
    }
  }, [readOnly, selectedAdjustment]);

  // Handle Edit Mode Transition
  const handleEditMode = () => {
    dispatch(setReadOnly(false));
    // Retain selectedAdjustment to keep form data intact
    // Avoid clearing selectedAdjustment and invoice details to prevent form reset
    setInvoiceError(false);
  };

  return (
    <Layout>
      <DashLayout>
        <div className="p-6 min-h-screen">
          {/* Read-Only Mode Alert with Edit Button */}
          {readOnly && selectedAdjustment && (
            <div className="bg-yellow-100 text-yellow-900 px-4 py-2 rounded-md mb-4 flex justify-between items-center">
              <span>Currently in read-only mode. You cannot edit these fields.</span>
              <button
                type="button"
                onClick={handleEditMode}
                className="bg-blue-500 text-white px-2 py-1 rounded-md"
              >
                Edit
              </button>
            </div>
          )}

          {/* Form Section */}
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={readOnly ? null : validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, resetForm, isSubmitting }) => (
              <Form id="create-adjustment-form">
                {/* Calculation Handler */}
                {!readOnly && <CalculateAmounts />}

                {/* Header Buttons */}
                {!readOnly && (
                  <div className="flex justify-end items-center mb-6 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        dispatch(clearSelectedInvoiceNumber());
                        dispatch(clearInvoiceFetchSuccess());
                        setInvoiceError(false);
                      }}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || loading}
                      className="px-4 py-2 rounded-md text-white"
                      style={{
                        background: "linear-gradient(to right, #ec4899, #a855f7)", // Pink to Purple
                      }}
                    >
                      {isSubmitting || loading
                        ? "Loading.."
                        : selectedAdjustment
                          ? "Save Changes"
                          : "Save Adjustment"}
                    </button>
                  </div>
                )}

                {/* Adjustment Details */}
                <h2 className="text-lg font-semibold mb-4">Adjustment Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Invoice Number */}
                  <div className="relative mb-6">
                    <Field name="invoiceNumber">
                      {({ field, form }) => (
                        <InvoiceTextInput
                          {...field}
                          label="Invoice Number"
                          placeholder="Enter invoice number (e.g., INV0003-202412-0001)"
                          required
                          type="text"
                          onChange={(e) => {
                            form.handleChange(e);
                            const value = e.target.value;
                            // Only dispatch setSelectedInvoiceNumber in Create Mode
                            if (!selectedAdjustment) {
                              dispatch(setSelectedInvoiceNumber(value));
                            }
                          }}
                          disabled={readOnly}
                          errorState={invoiceError}
                          isEditMode={!readOnly}
                        />
                      )}
                    </Field>
                  </div>

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
                    <div
                      className="p-6 rounded-md mb-6"
                      style={{ backgroundColor: "#ECECEC" }} // Box background color
                    >
                      {Array.isArray(values.items) &&
                        values.items.map((item, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-8 items-center mb-6"
                          >
                            {/* Revenue Type */}
                            <div className="col-span-3">
                              <SelectInput
                                name={`items.${index}.revenueType`}
                                label="Revenue Type"
                                options={[
                                  { value: "studentFee", label: "Student Fee" },
                                  { value: "FacilityRevenue", label: "Facility Revenue" },
                                  { value: "service_based_revenue", label: "Service-Based Revenue" },
                                  { value: "community_externalaffair_revenue", label: "Community External Affair Revenue" },
                                  { value: "financial_investment_revenue", label: "Financial Investment Revenue" },
                                  { value: "Penalties", label: "Penalties" },
                                  { value: "Other", label: "Other" },
                                ]}
                                placeholder="Select Revenue Type"
                                disabled={readOnly}
                                required
                              />

                            </div>

                            {/* Revenue Reference */}
                            <div className="" style={{ display: "none" }}>
                              <TextInput
                                name={`items.${index}.revenueReference`}
                                label="Revenue Reference"
                                placeholder="Enter Revenue Reference"
                                required
                                type="hidden"
                                readOnly={readOnly}
                                disabled={readOnly}

                              />
                            </div>

                            {/* Quantity */}
                            <div className="col-span-3">
                              <TextInput
                                name={`items.${index}.quantity`}
                                label="Quantity"
                                type="number"
                                placeholder="Enter Quantity"
                                required
                                min={1}
                                readOnly={readOnly}
                                disabled={readOnly}
                              />
                            </div>

                            {/* Amount */}
                            <div className="col-span-3">
                              <TextInput
                                name={`items.${index}.amount`}
                                label="Amount (QR)"
                                type="number"
                                placeholder="Enter Amount"
                                required
                                min={0}
                                readOnly={readOnly}
                                disabled={readOnly}
                              />
                            </div>

                            {/* Remove Item Button */}
                            <div className="col-span-1 flex justify-center">
                              {!readOnly && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="text-red-500 hover:text-red-700 text-xl"
                                  aria-label="Remove Item"
                                >
                                  ✖
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                      {/* Add Item Button */}
                      {!readOnly && (
                        <div className="flex flex-col justify-center items-center mt-6">
                          <button
                            type="button"
                            onClick={() =>
                              push({
                                revenueType: "",
                                revenueReference: "", // **Initialize as empty; user can fill or auto-filled later**
                                quantity: 1,
                                amount: 0,
                              })
                            }
                            className="rounded-full w-12 h-12 flex items-center justify-center"
                            style={{
                              background: "linear-gradient(to right, #ec4899, #a855f7)", // Gradient for Add Item button
                            }}
                          >
                            <span className="text-white text-2xl">+</span>
                          </button>
                          <span className="text-gray-600 text-sm mt-2">Add Item</span>
                        </div>
                      )}
                    </div>
                  )}
                </FieldArray>

                {/* Additional Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Sub Amount */}
                  <TextInput
                    name="subAmount"
                    label="Sub Amount (QR)"
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
                    label={`Discount (${values.discountType === "percentage" ? "%" : "QR"
                      })`}
                    placeholder={`Enter discount ${values.discountType === "percentage" ? "%" : "QR"
                      }`}
                    type="number"
                    readOnly={readOnly}
                    disabled={readOnly}
                  />

                  {/* Adjustment Penalty */}
                  <TextInput
                    name="adjustmentPenalty"
                    label="Adjustment Penalty (QR)"
                    placeholder="Enter penalty amount"
                    required
                    type="number"
                    readOnly={readOnly}
                    disabled={readOnly}
                  />

                  {/* Final Amount */}
                  <TextInput
                    name="finalAmount"
                    label="Final Amount (QR)"
                    placeholder="Final Amount"
                    type="number"
                    readOnly
                    disabled
                  />

                  {/* Document Upload Field */}
                  {!readOnly && (
                    <FileInput
                      name="document"
                      label="Upload Document (Optional)"
                      onChange={(e) => {
                        const fileUrl = e.target.value; // Assuming this is the URL after upload
                        setFieldValue("document", fileUrl);
                      }}
                      value={values.document}
                      readOnly={readOnly}
                      disabled={readOnly}
                    />
                  )}
                </div>

                {/* Display Success and Error Messages */}
                {!readOnly && successMessage && (
                  <div className="text-green-500 mb-4">{successMessage}</div>
                )}
                {!readOnly && error && (
                  <div className="text-red-500 mb-4">{error}</div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default CreatePenaltyAdjustment;
