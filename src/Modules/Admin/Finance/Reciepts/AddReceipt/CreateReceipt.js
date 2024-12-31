// src/Modules/Admin/Finance/Reciepts/AddReceipt/CreateReceipt.js

import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import ReturnItems from "./Components/ReturnItems";
import FileInput from "./Components/FileInput";
import { createReceipt } from "../../../../../Store/Slices/Finance/Receipts/receiptsThunks";
import { fetchInvoiceByNumber } from "../../../../../Store/Slices/Finance/Invoice/invoice.thunk";
import { toast } from "react-hot-toast";
import SelectInput from "../../PenaltiesandAdjustments/AddPenaltyAdjustment/Components/SelectInput";
import debounce from "lodash.debounce";
import { Spin, Tooltip } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const CreateReceipt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we came from "View (Read-Only)"
  const readOnly = location.state?.readOnly === true;
  const receiptData = location.state?.receiptData || null;

  // --- Local State for Invoice Number Handling ---
  const [invoiceStatus, setInvoiceStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [invoiceErrorMsg, setInvoiceErrorMsg] = useState("");

  // --- Utility to parse existing receipt data ---
  const parseReceiptData = (data) => {
    return {
      // Map backend fields to form fields
      receiverName: data.receiver?.name || "",
      mailId: data.receiver?.email || "",
      contactNumber: data.receiver?.phone || "",
      address: data.receiver?.address || "",
      discountType: data.discountType || "",
      tax: data.tax ? data.tax.toString() : "",
      discount: data.discount ? data.discount.toString() : "",
      penalty: data.penalty ? data.penalty.toString() : "",

      govtRefNumber: data.govtRefNumber || "",
      remark: data.remark || "",
      invoiceNumber: data.invoiceNumber || "",

      // document: null, // can't populate an existing file

      items: Array.isArray(data.lineItems)
        ? data.lineItems.map((item) => ({
            category: item.revenueType || "",
            quantity: item.quantity || "", // Ensure it's a string
            totalAmount: item.total !== undefined ? item.total.toString() : "", // Convert to string if exists
          }))
        : [{ category: "", quantity: "", totalAmount: "" }],
    };
  };

  // --- Initial Values ---
  const blankInitialValues = {
    receiverName: "",
    mailId: "",
    contactNumber: "",
    address: "",
    discountType: "",
    tax: "",
    discount: "",
    penalty: "",

    govtRefNumber: "",
    remark: "",
    invoiceNumber: "",

    // document: null,
    items: [{ category: "", quantity: "", totalAmount: "" }],
  };

  const initialValues = readOnly && receiptData
    ? parseReceiptData(receiptData)
    : blankInitialValues;

  // --- Validation Schema ---
  const validationSchema = Yup.object().shape({
    tax: Yup.number()
      .typeError("Tax must be a number")
      .min(0, "Tax must be positive")
      .required("Tax is required"),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"], "Invalid discount type")
      .required("Discount type is required"),
    discount: Yup.number()
      .typeError("Discount must be a number")
      .min(0, "Discount must be positive")
      .required("Discount is required"),
    penalty: Yup.number()
      .typeError("Penalty must be a number")
      .min(0, "Penalty must be positive")
      .required("Penalty is required"),

    contactNumber: Yup.string().required("Contact number is required"),
    mailId: Yup.string().email("Invalid email address").required("Email is required"),
    address: Yup.string().required("Address is required"),
    receiverName: Yup.string().required("Name is required"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          category: Yup.string().required("Category is required"),
          quantity: Yup.string() // Change to string to match backend
            .required("Quantity is required"),
          totalAmount: Yup.number()
            .typeError("Total Amount must be a number")
            .min(0, "Total Amount cannot be negative")
            .required("Total Amount is required"),
        })
      )
      .min(1, "At least one line item is required"),
  });

  // --- Format Invoice Number with Dashes ---
  const formatInvoiceNumber = (value) => {
    // Remove all non-alphanumeric characters
    const raw = value.replace(/[^a-zA-Z0-9]/g, "");

    // Assuming the format is SCHOOLCODE-YYYYMM-SSSS
    // Example: ABCD-202401-0001

    // Define lengths
    const schoolCodeLength = 4;
    const yearMonthLength = 6;
    const sequenceLength = 4;

    let formatted = "";

    if (raw.length > 0) {
      formatted += raw.substring(0, Math.min(schoolCodeLength, raw.length));
    }
    if (raw.length > schoolCodeLength) {
      formatted += "-" + raw.substring(schoolCodeLength, Math.min(schoolCodeLength + yearMonthLength, raw.length));
    }
    if (raw.length > schoolCodeLength + yearMonthLength) {
      formatted += "-" + raw.substring(schoolCodeLength + yearMonthLength, Math.min(schoolCodeLength + yearMonthLength + sequenceLength, raw.length));
    }

    return formatted.toUpperCase();
  };

  // --- Debounced Function to Fetch Invoice Data ---
  const debouncedFetchInvoice = useCallback(
    debounce((invoiceNumber, setFieldValue) => {
      if (!invoiceNumber) {
        setInvoiceStatus("idle");
        setInvoiceErrorMsg("");
        return;
      }

      setInvoiceStatus("loading");
      setInvoiceErrorMsg("");

      dispatch(fetchInvoiceByNumber(invoiceNumber))
        .unwrap()
        .then((data) => {
          setInvoiceStatus("success");
          setInvoiceErrorMsg("");

          // Preload invoice data into form fields
          const parsedData = parseReceiptData(data);
          Object.keys(parsedData).forEach((key) => {
            if (key !== "items" && key !== "invoiceNumber") {
              setFieldValue(key, parsedData[key]);
            }
          });

          // Handle line items separately
          if (parsedData.items && parsedData.items.length > 0) {
            setFieldValue("items", parsedData.items);
          }
        })
        .catch((error) => {
          setInvoiceStatus("error");
          setInvoiceErrorMsg(error || "Invoice not found.");
        });
    }, 500),
    [dispatch, parseReceiptData]
  );

  // --- Handle Submit (disabled if readOnly) ---
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (readOnly) {
      setSubmitting(false);
      return;
    }

    const formValues = {
      tax: parseFloat(values.tax) || 0,
      discount: parseFloat(values.discount) || 0,
      penalty: parseFloat(values.penalty) || 0,
      discountType: values.discountType || "",
      govtRefNumber: values.govtRefNumber || "",
      remark: values.remark || "",
      invoiceNumber: values.invoiceNumber || "",
      receiver: {
        name: values.receiverName,
        email: values.mailId,
        phone: values.contactNumber,
        address: values.address,
      },
      lineItems: values.items.map((item) => ({
        revenueType: item.category,
        quantity: item.quantity, // Keep as string
        total: parseFloat(item.totalAmount) || 0,
      })),
    };

    // Debugging: Log formValues
    console.log("Submitting Form Values:", formValues);

    dispatch(createReceipt(formValues))
      .unwrap()
      .then((response) => {
        if (response?.message === "Receipt created successfully") {
          toast.success("Receipt created successfully!");
          resetForm();
          navigate("/finance/receipts/receipt-list");
        } else {
          toast.error("Failed to create receipt.");
        }
      })
      .catch((err) => {
        console.error("Error creating receipt:", err);
        toast.error("Error creating receipt.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <DashLayout>
      <div className="p-6 min-h-screen">
        {/* If read-only, show a top banner */}
        {readOnly && (
          <div className="bg-yellow-100 text-yellow-900 px-4 py-2 rounded-md mb-4">
            Currently in read-only mode. You cannot edit these fields.
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, resetForm, values, setFieldValue }) => {
            // Handle changes to invoiceNumber to reset status
            useEffect(() => {
              setInvoiceStatus("idle");
              setInvoiceErrorMsg("");
            }, [values.invoiceNumber]);

            return (
              <Form id="create-receipt-form">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-semibold">
                    {readOnly ? "View Receipt" : "Create Receipt"}
                  </h1>
                  {!readOnly && (
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => resetForm()}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-md text-white"
                        style={{
                          background: "linear-gradient(to right, #ec4899, #a855f7)",
                        }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Creating..." : "Create Receipt"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Receiver Info */}
                <h2 className="text-lg font-semibold mb-4">Receiver Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <TextInput
                    name="receiverName"
                    label="Student Name *"
                    placeholder="Enter name"
                    disabled={readOnly}
                  />
                  <TextInput
                    name="address"
                    label="Address *"
                    placeholder="Enter address"
                    disabled={readOnly}
                  />
                  <TextInput
                    name="contactNumber"
                    label="Contact Number *"
                    placeholder="Enter contact number"
                    disabled={readOnly}
                  />
                  <TextInput
                    name="mailId"
                    label="Email *"
                    placeholder="Enter email"
                    disabled={readOnly}
                  />

                  {/* --- Enhanced Invoice Number Field --- */}
                  <div className="relative">
                    <TextInput
                      name="invoiceNumber" // Renamed from invoiceRefId to invoiceNumber
                      label="Invoice Reference Number" // You can update the label if needed
                      placeholder="Enter invoice reference number"
                      disabled={readOnly}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        const formattedValue = formatInvoiceNumber(rawValue); // Format invoice number with dashes
                        setFieldValue("invoiceNumber", formattedValue); // Update Formik field value
                        debouncedFetchInvoice(formattedValue, setFieldValue); // Fetch invoice data
                      }}
                    />
                    {/* Feedback Icons */}
                    {!readOnly && (
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        {invoiceStatus === "loading" && <Spin size="small" />}
                        {invoiceStatus === "success" && (
                          <Tooltip title="Invoice loaded successfully">
                            <CheckCircleOutlined style={{ color: "green", fontSize: "16px" }} />
                          </Tooltip>
                        )}
                        {invoiceStatus === "error" && (
                          <Tooltip title={invoiceErrorMsg || "Invoice not found"}>
                            <CloseCircleOutlined style={{ color: "red", fontSize: "16px" }} />
                          </Tooltip>
                        )}
                      </div>
                    )}
                    {/* Validation Error */}
                    <ErrorMessage name="invoiceNumber">
                      {(msg) => <div className="text-red-500 text-sm mt-1">{msg}</div>}
                    </ErrorMessage>
                  </div>
                  {/* --- End Enhanced Invoice Number Field --- */}
                </div>

                {/* Return Items */}
                {/* Pass readOnly so we can disable those fields in ReturnItems */}
                <ReturnItems
                  values={values}
                  setFieldValue={setFieldValue}
                  readOnly={readOnly}
                />

                {/* Payment Info */}
                <h2 className="text-lg font-semibold mb-4 mt-6">Payment Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <TextInput
                    name="tax"
                    label="Tax *"
                    placeholder="Enter tax amount"
                    disabled={readOnly}
                  />
                  <TextInput
                    name="discount"
                    label="Discount *"
                    placeholder="Enter discount"
                    disabled={readOnly}
                  />
                  <SelectInput
                    name="discountType"
                    label="Discount Type *"
                    options={[
                      { value: "percentage", label: "Percentage" },
                      { value: "amount", label: "Fixed Amount" }, // Changed to "amount"
                    ]}
                    placeholder="Select discount type"
                    disabled={readOnly}
                  />

                  <TextInput
                    name="penalty"
                    label="Penalty *"
                    placeholder="Enter penalty"
                    disabled={readOnly}
                  />

                  {/* Optional fields */}
                  <TextInput
                    name="govtRefNumber"
                    label="Government Reference Number"
                    placeholder="Enter reference number"
                    disabled={readOnly}
                  />
                  <TextInput
                    name="remark"
                    label="Remarks"
                    placeholder="Any remarks here"
                    disabled={readOnly}
                  />
                  {/* <FileInput
                    name="document"
                    label="Add Document (if any)"
                    placeholder="Upload file"
                    onChange={(e) => {
                      if (!readOnly) {
                        setFieldValue("document", e.currentTarget.files[0]);
                      }
                    }}
                    disabled={readOnly}
                  /> */}
                </div>
              </Form>
            )}
          }
          </Formik>
        </div>
      </DashLayout>
    );
};

export default CreateReceipt;
