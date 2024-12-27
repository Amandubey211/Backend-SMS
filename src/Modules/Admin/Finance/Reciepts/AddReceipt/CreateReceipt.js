import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import ReturnItems from "./Components/ReturnItems";
import FileInput from "./Components/FileInput";
import { createReceipt } from "../../../../../Store/Slices/Finance/Receipts/receiptsThunks";
import { toast } from "react-hot-toast";

const CreateReceipt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we came from "View (Read-Only)"
  const readOnly = location.state?.readOnly === true;
  const receiptData = location.state?.receiptData || null;

  // --- Utility to parse existing receipt data ---
  const parseReceiptData = (data) => {
    return {
      // Map backend fields to form fields
      receiverName: data.receiver?.name || "",
      mailId: data.receiver?.email || "",
      contactNumber: data.receiver?.phone || "",
      address: data.receiver?.address || "",

      tax: data.tax ? data.tax.toString() : "",
      discount: data.discount ? data.discount.toString() : "",
      penalty: data.penalty ? data.penalty.toString() : "",
      totalPaidAmount: data.totalPaidAmount ? data.totalPaidAmount.toString() : "",

      govtRefNumber: data.govtRefNumber || "",
      remark: data.remark || "",
      invoiceRefId: data.invoiceRefId || "", // optional

      document: null, // can't populate an existing file

      items: Array.isArray(data.lineItems)
        ? data.lineItems.map((item) => ({
          category: item.revenueType || "",
          quantity: item.quantity?.toString() || "",
          totalAmount: item.total?.toString() || "",
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

    tax: "",
    discount: "",
    penalty: "",
    totalPaidAmount: "",

    govtRefNumber: "",
    remark: "",
    invoiceRefId: "",

    document: null,
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
    discount: Yup.number()
      .typeError("Discount must be a number")
      .min(0, "Discount must be positive")
      .required("Discount is required"),
    penalty: Yup.number()
      .typeError("Penalty must be a number")
      .min(0, "Penalty must be positive")
      .required("Penalty is required"),
    totalPaidAmount: Yup.number()
      .typeError("Total Paid must be a number")
      .min(0, "Total Paid must be positive")
      .required("Total Paid Amount is required"),

    contactNumber: Yup.string().required("Contact number is required"),
    mailId: Yup.string().email("Invalid email address").required("Email is required"),
    address: Yup.string().required("Address is required"),
    receiverName: Yup.string().required("Name is required"),

    items: Yup.array()
      .of(
        Yup.object().shape({
          category: Yup.string().required("Category is required"),
          quantity: Yup.number()
            .typeError("Quantity must be a number")
            .min(1, "Quantity must be at least 1")
            .required("Quantity is required"),
          totalAmount: Yup.number()
            .typeError("Total Amount must be a number")
            .min(0, "Total Amount cannot be negative")
            .required("Total Amount is required"),
        })
      )
      .min(1, "At least one line item is required"),

    // invoiceRefId is optional
  });

  // --- Handle Submit (disabled if readOnly) ---
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // If read-only, do nothing
    if (readOnly) {
      setSubmitting(false);
      return;
    }

    // Prepare payload
    const formValues = {
      tax: values.tax || 0,
      discount: values.discount || 0,
      penalty: values.penalty || 0,
      totalPaidAmount: values.totalPaidAmount || 0,

      govtRefNumber: values.govtRefNumber || "",
      remark: values.remark || "",
      invoiceRefId: values.invoiceRefId || "",

      receiver: {
        name: values.receiverName,
        email: values.mailId,
        phone: values.contactNumber,
        address: values.address,
      },
      lineItems: values.items.map((item) => ({
        revenueType: item.category,
        quantity: item.quantity,
        total: item.totalAmount,
      })),
      document: values.document,
    };

    dispatch(createReceipt(formValues))
      .unwrap()
      .then(() => {
        toast.success("Receipt created successfully!");
        resetForm();
        navigate("/finance/receipts");
      })
      .catch((err) => {
        console.error("Error creating receipt:", err);
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
          {({ isSubmitting, resetForm, values, setFieldValue }) => (
            <Form id="create-receipt-form">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">
                  {readOnly ? "View Receipt" : "Create Receipts"}
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
              </div>

              {/* Return Items */}
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
                <TextInput
                  name="penalty"
                  label="Penalty *"
                  placeholder="Enter penalty"
                  disabled={readOnly}
                />
                <TextInput
                  name="totalPaidAmount"
                  label="Total Paid *"
                  placeholder="Enter total paid amount"
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
                  name="invoiceRefId"
                  label="Invoice Reference ID"
                  placeholder="Enter invoice ref ID"
                  disabled={readOnly}
                />
                <TextInput
                  name="remark"
                  label="Remarks"
                  placeholder="Any remarks here"
                  disabled={readOnly}
                />
                <FileInput
                  name="document"
                  label="Add Document (if any)"
                  placeholder="Upload file"
                  onChange={(e) => {
                    if (!readOnly) {
                      setFieldValue("document", e.currentTarget.files[0]);
                    }
                  }}
                  disabled={readOnly}
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
