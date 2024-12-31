import React, { useEffect } from "react";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import SelectInput from "./Components/SelectInput";
import ReturnItems from "./Components/ReturnItems";
import { useDispatch, useSelector } from "react-redux";
import { createAdjustment } from "../../../../../Store/Slices/Finance/PenalityandAdjustment/adjustment.thunk";
import {clearSelectedInvoiceNumber} from "../../../../../Store/Slices/Finance/Invoice/invoiceSlice";
import {fetchInvoiceByNumber} from "../../../../../Store/Slices/Finance/Invoice/invoice.thunk";
import { useNavigate } from "react-router-dom";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
import useDebounce from "../../../../../Hooks/CommonHooks/useDebounce"; // Adjust the import path as necessary

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


  useEffect(() => {
    if (selectedInvoiceNumber) {
      const invoiceNumberPattern = /^INV\d{4}-\d{6}-\d{4}$/; // Adjust regex based on exact format
      if (invoiceNumberPattern.test(selectedInvoiceNumber)) {
        dispatch(fetchInvoiceByNumber(selectedInvoiceNumber));
      }
    }
  }, [selectedInvoiceNumber, dispatch]);
  
  // Debounce the invoice number input by 500ms
  const [invoiceNumberInput, setInvoiceNumberInput] = React.useState("");
  const debouncedInvoiceNumber = useDebounce(invoiceNumberInput, 500);

  // Define initial values based on backend requirements
  const initialValues = {
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
      items: values.items.map((item) => ({
        revenueType: item.revenueType,
        revenueReference: item.revenueReference,
        quantity: item.quantity,
        amount: item.amount,
      })),
      reason: values.reason,
      discountType: values.discountType,
      discount: Number(values.discount),
      adjustmentPenalty: Number(values.adjustmentPenalty),
      tax: Number(values.tax),
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
    if (debouncedInvoiceNumber && invoiceNumberPattern.test(debouncedInvoiceNumber)) {
      dispatch(fetchInvoiceByNumber(debouncedInvoiceNumber));
    }
  }, [debouncedInvoiceNumber, dispatch]);

  // Reference to Formik to set field values outside Formik's render props
  const formikRef = React.useRef();

  // Prefill form fields when invoice details are fetched successfully
  useEffect(() => {
    if (invoiceFetchSuccess && invoiceDetails) {
      // Prefill the form fields with invoiceDetails
      formikRef.current.setFieldValue("invoiceNumber", invoiceDetails.invoiceNumber);
      formikRef.current.setFieldValue("reason", ""); // You can set a default reason or fetch from invoiceDetails if available
      formikRef.current.setFieldValue("discountType", invoiceDetails.discountType || "amount"); // Default discount type; adjust as needed
      formikRef.current.setFieldValue("discount", invoiceDetails.discount || 0);
      formikRef.current.setFieldValue("adjustmentPenalty", invoiceDetails.penalty || 0);
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
      // Show success message
      // toast.success("Invoice data fetched successfully!"); // Already handled in thunk
      // Clear selectedInvoiceNumber to allow manual entries in future
      dispatch(clearSelectedInvoiceNumber());
    }
  }, [invoiceFetchSuccess, invoiceDetails, dispatch]);
  console.log('this is invoice number: ' + selectedInvoiceNumber);

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
              {/* Header Buttons */}
              <div className="flex justify-end items-center mb-6">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      formik.resetForm();
                      // toast.success("Form has been reset."); // Already handled in thunk
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
                <TextInput
                  name="invoiceNumber"
                  label="Invoice Number *"
                  placeholder="Enter invoice number (e.g., INV0003-202412-0001)"
                  required
                  type="text"
                  value={invoiceNumberInput}
                  onChange={(e) => setInvoiceNumberInput(e.target.value)}
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
                values={formik.values}
                setFieldValue={formik.setFieldValue}
                required
              />

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
