// src/Modules/Admin/Finance/Receipts/AddReceipt/CreateReceipt.js

import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import InvoiceTextInput from "./Components/InvoiceTextInput";
import ReturnItems from "./Components/ReturnItems";
import SelectInput from "../../PenaltiesandAdjustments/AddPenaltyAdjustment/Components/SelectInput";
import { fetchInvoiceByNumber } from "../../../../../Store/Slices/Finance/Invoice/invoice.thunk";
import {
  clearSelectedInvoiceNumber,
  setSelectedInvoiceNumber,
  clearInvoiceFetchSuccess,
} from "../../../../../Store/Slices/Finance/Invoice/invoiceSlice";
import { createReceipt } from "../../../../../Store/Slices/Finance/Receipts/receiptsThunks";
import useDebounce from "../../../../../Hooks/CommonHooks/useDebounce";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
import FileInput from "./Components/FileInput";
import { calculateFinalAmounts } from "../../../../../Utils/calculateFinalAmounts";

const CalculationHandler = () => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    const total_amount = values.items.reduce(
      (acc, item) => acc + Number(item.totalAmount || 0),
      0
    );

    const calculated = calculateFinalAmounts({
      total_amount,
      discountType: values.discountType,
      discount: Number(values.discount),
      tax: Number(values.tax),
      penalty: Number(values.penalty),
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
    values.penalty,
    setFieldValue,
  ]);

  return null;
};

const CreateReceipt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const formikRef = useRef();

  useNavHeading("Finance", "Create Receipt");

  // Extract readOnly and receiptData from location.state
  const { readOnly, receiptData } = location.state || {};
  const isReadOnly = readOnly === true;

  // Manage local read-only and edit modes
  const [isReadOnlyState, setIsReadOnlyState] = useState(isReadOnly);
  const [isEditMode, setIsEditMode] = useState(false); // New flag for edit mode

  // Initialize fetchedInvoiceNumber to prevent infinite API requests
  const [fetchedInvoiceNumber, setFetchedInvoiceNumber] = useState("");

  // State to handle form resetting
  const [isFormResetting, setIsFormResetting] = useState(false);

  // Define initialValues based on read-only mode
  const prefilledValues =
    isReadOnly && receiptData
      ? {
          receiverName: receiptData.receiver?.name || "",
          mailId: receiptData.receiver?.email || "",
          contactNumber: receiptData.receiver?.phone || "",
          address: receiptData.receiver?.address || "",
          discountType: receiptData.discountType || "amount",
          discount: receiptData.discount || 0,
          penalty: receiptData.penalty || 0,
          tax: receiptData.tax || 0,
          govtRefNumber: receiptData.govtRefNumber || "",
          remark: receiptData.remark || "",
          // Ensure invoiceNumber is a string
          invoiceNumber:
            typeof receiptData.invoiceNumber === "string"
              ? receiptData.invoiceNumber
              : receiptData.invoiceNumber
              ? String(
                  receiptData.invoiceNumber.number ||
                    receiptData.invoiceNumber.invoiceNumber ||
                    receiptData.invoiceNumber
                )
              : "",

          items:
            receiptData.lineItems?.map((item) => ({
              category: item.revenueType || "",
              quantity: Number(item.quantity) || 0,
              totalAmount: Number(item.total) || 0,
              subCategory: "",
              stationeries: [],
            })) || [
              {
                category: "",
                quantity: 0,
                totalAmount: 0,
                subCategory: "",
                stationeries: [
                  {
                    itemName: "",
                    quantity: 0,
                    unitCost: 0,
                  },
                ],
              },
            ],
          subAmount: Number(receiptData.subAmount) || 0,
          finalAmount: Number(receiptData.finalAmount) || 0,
          document: receiptData.document || null,
        }
      : null;

  const blankInitialValues = {
    receiverName: "",
    mailId: "",
    contactNumber: "",
    address: "",
    discountType: "amount",
    tax: 0,
    discount: 0,
    penalty: 0,
    govtRefNumber: "",
    remark: "",
    invoiceNumber: "",
    items: [
      {
        category: "",
        quantity: "",
        totalAmount: "",
        subCategory: "",
        stationeries: [],
      },
    ],
    subAmount: 0,
    finalAmount: 0,
    document: null,
  };

  const initialValues = isReadOnlyState && prefilledValues ? prefilledValues : blankInitialValues;

  // Track invoice input
  const [invoiceNumberInput, setInvoiceNumberInput] = useState(initialValues.invoiceNumber || "");
  const debouncedInvoiceNumber = useDebounce(invoiceNumberInput, 500);

  const {
    invoiceDetails,
    invoiceFetchSuccess,
    error = null,
    selectedInvoiceNumber = "",
  } = useSelector((state) => state.admin.invoices || {});

  const validationSchema = Yup.object().shape({
    invoiceNumber: Yup.string().required("Invoice number is required"),
    receiverName: Yup.string().required("Name is required"),
    mailId: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    contactNumber: Yup.string().required("Contact number is required"),
    address: Yup.string().required("Address is required"),
    discountType: Yup.string()
      .oneOf(
        ["percentage", "amount"],
        "Discount Type must be 'percentage' or 'amount'"
      )
      .required("Discount Type is required"),
    discount: Yup.number()
      .min(0, "Discount cannot be negative")
      .required("Discount is required"),
    penalty: Yup.number()
      .min(0, "Penalty cannot be negative")
      .required("Penalty is required"),
    tax: Yup.number()
      .min(0, "Tax cannot be less than 0")
      .max(100, "Tax cannot exceed 100")
      .required("Tax is required"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          category: Yup.string().required("Category is required"),
          quantity: Yup.number()
            .min(1, "Quantity must be at least 1")
            .required("Quantity is required"),
          totalAmount: Yup.number()
            .min(0, "Total Amount cannot be negative")
            .required("Total Amount is required"),
        })
      )
      .min(1, "At least one line item is required"),
    subAmount: Yup.number().min(0).notRequired(),
    finalAmount: Yup.number().min(0).notRequired(),
    document: Yup.string().nullable(),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (isReadOnlyState) {
      // Do not submit if in read-only mode
      setSubmitting(false);
      return;
    }

    const formValues = {
      receiver: {
        name: values.receiverName,
        email: values.mailId,
        phone: values.contactNumber,
        address: values.address,
      },
      discountType: values.discountType,
      discount: Number(values.discount),
      penalty: Number(values.penalty),
      tax: Number(values.tax),
      govtRefNumber: values.govtRefNumber,
      remark: values.remark,
      invoiceNumber: values.invoiceNumber,
      lineItems: values.items.map((item) => ({
        revenueType: item.category,
        quantity: Number(item.quantity),
        total: Number(item.totalAmount),
      })),
      finalAmount: values.finalAmount, // Include finalAmount in the payload
      document: values.document, // Include document if needed
    };

    dispatch(createReceipt(formValues))
      .unwrap()
      .then(() => {
        resetForm();
        navigate("/finance/receipts/receipt-list");
      })
      .catch((err) => {
        // Optionally handle errors here
        console.error("Failed to create receipt:", err);
      })
      .finally(() => setSubmitting(false));
  };

  // Fetch invoice details when debounced invoice number changes and is valid (only in create mode)
  useEffect(() => {
    if (isReadOnlyState || isEditMode) return; // Do not fetch if in read-only or edit mode
    if (isFormResetting) return; // Do not fetch if form is resetting

    const invoiceNumberPattern = /^INV\d{4}-\d{6}-\d{4}$/; // Adjust regex based on exact format
    if (debouncedInvoiceNumber && invoiceNumberPattern.test(debouncedInvoiceNumber)) {
      if (debouncedInvoiceNumber !== fetchedInvoiceNumber) {
        dispatch(fetchInvoiceByNumber(debouncedInvoiceNumber));
        setFetchedInvoiceNumber(debouncedInvoiceNumber); // Update fetchedInvoiceNumber
      }
    } else if (debouncedInvoiceNumber === "" && fetchedInvoiceNumber !== "") {
      // Only reset if previously fetchedInvoiceNumber was not ""
      if (formikRef.current) {
        setIsFormResetting(true); // Indicate that form is resetting
        formikRef.current.setValues(blankInitialValues);
        setFetchedInvoiceNumber("");
        setIsFormResetting(false); // Reset the flag after form reset
      }
    }
  }, [
    debouncedInvoiceNumber,
    dispatch,
    isReadOnlyState,
    isEditMode, // Added to dependencies
    fetchedInvoiceNumber,
    blankInitialValues,
    isFormResetting, // Added to dependencies
  ]);

  // Prefill form when invoice details are fetched successfully (only in create mode)
  useEffect(() => {
    if (invoiceFetchSuccess && invoiceDetails && !isReadOnlyState && !isEditMode) {
      const prefilledValues = {
        receiverName: invoiceDetails?.receiver?.name || "",
        mailId: invoiceDetails?.receiver?.email || "",
        contactNumber: invoiceDetails?.receiver?.contact || "",
        address: invoiceDetails?.receiver?.address || "",
        discountType: invoiceDetails?.discountType || "amount",
        discount: invoiceDetails?.discount || 0,
        penalty: invoiceDetails?.penalty || 0,
        tax: invoiceDetails?.tax || 0,
        govtRefNumber: "",
        remark: "",
        invoiceNumber: invoiceDetails?.invoiceNumber
          ? typeof invoiceDetails.invoiceNumber === "string"
            ? invoiceDetails.invoiceNumber
            : invoiceDetails.invoiceNumber.number
            ? String(invoiceDetails.invoiceNumber.number)
            : String(invoiceDetails.invoiceNumber)
          : "",
        items:
          invoiceDetails?.lineItems?.map((item) => ({
            category: item?.revenueType || "",
            quantity: item?.quantity || 0,
            totalAmount: item?.amount || 0,
            subCategory: item?.revenueReference?.subCategory || "",
            stationeries:
              item?.revenueReference?.stationeryItems?.map((stationery) => ({
                itemName: stationery?.itemName || "",
                quantity: stationery?.quantity || 0,
                unitCost: stationery?.unitCost || 0,
              })) || [],
          })) || [
            {
              category: "",
              quantity: 0,
              totalAmount: 0,
              subCategory: "",
              stationeries: [
                {
                  itemName: "",
                  quantity: 0,
                  unitCost: 0,
                },
              ],
            },
          ],
        subAmount: 0, // Initialize subAmount
        finalAmount: 0, // Initialize finalAmount
        document: null, // Initialize document
      };

      // Debugging: Log the prefilled invoice number
      console.log("Prefilled Invoice Number:", prefilledValues.invoiceNumber);
      console.log("Invoice Details:", invoiceDetails);

      formikRef.current.setValues(prefilledValues);
      setFetchedInvoiceNumber(prefilledValues.invoiceNumber);
      setInvoiceNumberInput(prefilledValues.invoiceNumber); // Synchronize invoiceNumberInput
      dispatch(clearSelectedInvoiceNumber());
      dispatch(clearInvoiceFetchSuccess()); // Clear fetch success flag
    }
  }, [invoiceFetchSuccess, invoiceDetails, dispatch, isReadOnlyState, isEditMode]);

  // Synchronize invoiceNumberInput when initialValues change (especially in read-only mode)
  useEffect(() => {
    setInvoiceNumberInput(initialValues.invoiceNumber || "");
    // Debugging: Log the initial invoice number
    console.log("Initial Invoice Number:", initialValues.invoiceNumber);
  }, [initialValues.invoiceNumber]);

  // Handle Edit Mode Transition
  const handleEditMode = () => {
    setIsReadOnlyState(false);
    setIsEditMode(true); // Set edit mode
    dispatch(clearSelectedInvoiceNumber()); // Clear selectedInvoiceNumber to prevent API calls
    dispatch(clearInvoiceFetchSuccess()); // Clear fetch success flag
  };

  return (
    <DashLayout>
      <div className="p-6 min-h-screen">
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          enableReinitialize={false} // Prevent Formik from resetting the form on state changes
          validationSchema={isReadOnlyState ? null : validationSchema} // Skip validation in read-only
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue, resetForm }) => (
            <Form>
              {/* Calculation Handler */}
              {!isReadOnlyState && <CalculationHandler />}

              {/* Read-Only Mode Message */}
              {isReadOnlyState && (
                <div className="flex justify-between items-center bg-yellow-100 text-yellow-700 p-2 rounded-md text-sm mb-4">
                  <span>
                    Currently in read-only mode. You cannot edit these fields.
                  </span>
                  <button
                    type="button"
                    onClick={handleEditMode}
                    className="flex items-center px-2 py-1 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-transform duration-200"
                  >
                    Edit
                  </button>
                </div>
              )}

              {/* Header with Buttons */}
              <div className="flex justify-end mb-2 space-x-4">
                {!isReadOnlyState && (
                  <>
                    <button
                      type="button" // Changed from "reset" to "button"
                      onClick={() => {
                        setIsFormResetting(true); // Indicate that form is resetting
                        resetForm();
                        setInvoiceNumberInput("");
                        setFetchedInvoiceNumber("");
                        dispatch(clearSelectedInvoiceNumber());
                        dispatch(clearInvoiceFetchSuccess()); // Clear fetch success flag
                        setIsFormResetting(false); // Reset the flag after form reset
                      }}
                      className="px-4 py-2 rounded-md text-white transition duration-300"
                      style={{
                        background: "linear-gradient(to right, #ec4899, #a855f7)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(to right, #a855f7, #ec4899)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(to right, #ec4899, #a855f7)")
                      }
                      disabled={isSubmitting}
                    >
                      Reset
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-md text-white transition duration-300"
                      style={{
                        background: "linear-gradient(to right, #ec4899, #a855f7)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(to right, #a855f7, #ec4899)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(to right, #ec4899, #a855f7)")
                      }
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Create Receipt"}
                    </button>
                  </>
                )}
                {/* Removed the "Back" button */}
              </div>

              {/* Receiver Details */}
              <h2 className="text-lg font-semibold mb-4">Receiver Details</h2>
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
                        setInvoiceNumberInput(value);

                        // Debugging: Log the input value
                        console.log("Invoice Number Input Changed:", value);

                        if (value !== fetchedInvoiceNumber) {
                          form.setFieldValue("receiverName", "");
                          form.setFieldValue("mailId", "");
                          form.setFieldValue("contactNumber", "");
                          form.setFieldValue("address", "");
                          form.setFieldValue("discountType", "amount");
                          form.setFieldValue("discount", 0);
                          form.setFieldValue("penalty", 0);
                          form.setFieldValue("tax", 0);
                          form.setFieldValue("govtRefNumber", "");
                          form.setFieldValue("remark", "");
                          form.setFieldValue("items", [
                            {
                              category: "",
                              revenueReference: "",
                              quantity: "",
                              totalAmount: "",
                              subCategory: "",
                              stationeries: [],
                            },
                          ]);
                          form.setFieldValue("subAmount", 0, false);
                          form.setFieldValue("finalAmount", 0, false);
                          setFetchedInvoiceNumber("");

                          // If in create mode, set the selectedInvoiceNumber in Redux
                          if (!isEditMode) {
                            dispatch(setSelectedInvoiceNumber(value));
                          }
                        }
                      }}
                      disabled={isReadOnlyState} // Disable input in read-only mode
                    />
                  )}
                </Field>
              </div>

              {/* Receiver Details Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <TextInput
                  name="receiverName"
                  label="Receiver Name"
                  placeholder="Enter receiver name"
                  required
                  disabled={isReadOnlyState} // Disable in read-only
                />
                <TextInput
                  name="address"
                  label="Address"
                  placeholder="Enter address"
                  required
                  disabled={isReadOnlyState}
                />
                <TextInput
                  name="contactNumber"
                  label="Contact Number"
                  placeholder="Enter contact number"
                  required
                  disabled={isReadOnlyState}
                />
                <TextInput
                  name="mailId"
                  label="Email"
                  placeholder="Enter email"
                  required
                  disabled={isReadOnlyState}
                />
              </div>

              {/* Items */}
              <h2 className="text-lg font-semibold mb-4">Adjustment Items</h2>
              <ReturnItems
                values={values}
                setFieldValue={setFieldValue}
                disabled={isReadOnlyState} // Pass disabled prop
              />

              {/* Payment Info */}
              <h2 className="text-lg font-semibold mb-4 mt-6">Payment Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Tax Field with Percent Icon */}
                <div className="relative">
                  <label htmlFor="tax" className="text-sm text-gray-500 block mb-1">
                    Tax <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="tax"
                    name="tax"
                    type="number"
                    placeholder="Enter tax"
                    className="bg-white border border-gray-300 rounded-md px-4 py-3 pr-10 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300"
                    autoComplete="off"
                    aria-required="true"
                    min="0"
                    max="100"
                    disabled={isReadOnlyState} // Disable in read-only
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  <ErrorMessage
                    name="tax"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <TextInput
                  name="discount"
                  label="Discount"
                  placeholder="Enter discount"
                  required
                  disabled={isReadOnlyState}
                />

                <SelectInput
                  name="discountType"
                  label="Discount Type"
                  options={[
                    { value: "percentage", label: "Percentage" },
                    { value: "amount", label: "Fixed Amount" },
                  ]}
                  disabled={isReadOnlyState}
                />

                <TextInput
                  name="penalty"
                  label="Penalty"
                  placeholder="Enter penalty"
                  required
                  disabled={isReadOnlyState}
                />

                <TextInput
                  name="govtRefNumber"
                  label="Government Reference Number"
                  placeholder="Enter reference number"
                  disabled={isReadOnlyState}
                />

                <TextInput
                  name="remark"
                  label="Remarks"
                  placeholder="Add remarks"
                  disabled={isReadOnlyState}
                />

                {/* Document Upload Field */}
                {!isReadOnlyState && (
                  <FileInput
                    label="Upload Document (Optional)"
                    name="document"
                    onChange={(e) => {
                      const fileUrl = e.target.value;
                      setFieldValue("document", fileUrl);
                    }}
                    value={values.document}
                  />
                )}

                {/* Sub Amount (Read-only) */}
                <TextInput
                  name="subAmount"
                  label="Sub Amount"
                  placeholder="Sub Amount"
                  type="number"
                  disabled // Always disabled
                />
                {/* Final Amount (Read-only) */}
                <TextInput
                  name="finalAmount"
                  label="Final Amount"
                  placeholder="Final Amount"
                  type="number"
                  disabled // Always disabled
                />
              </div>

              {/* Display Error Messages */}
              {!isReadOnlyState && error && (
                <div className="text-red-500 mb-4">{error}</div>
              )}
              {/* Optionally, add success messages if needed */}
            </Form>
          )}
        </Formik>
      </div>
    </DashLayout>
  );
};

export default CreateReceipt;
