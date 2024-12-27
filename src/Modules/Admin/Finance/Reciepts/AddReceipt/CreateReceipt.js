import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import ReturnItems from "./Components/ReturnItems";
import FileInput from "./Components/FileInput";
import { createReceipt } from "../../../../../Store/Slices/Finance/Receipts/receiptsThunks";

const CreateReceipt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // -------------
  // INITIAL VALUES
  // -------------
  // Keep only fields required by backend:
  // (tax, discount, penalty, totalPaidAmount, govtRefNumber, remark, receiver, lineItems, document)
  const initialValues = {
    receiverName: "",     // This will map to receiver.name
    mailId: "",           // This will map to receiver.email
    contactNumber: "",    // receiver.phone
    address: "",          // receiver.address

    tax: "",
    discount: "",
    penalty: "",
    totalPaidAmount: "",  // Maps to totalPaidAmount in backend

    govtRefNumber: "",
    remark: "",           // Maps to remark in backend

    document: null,       // For file upload

    // lineItems -> items in Formik
    items: [
      { category: "", quantity: "", totalAmount: "" }
    ],
  };

  // -------------------
  // VALIDATION SCHEMA
  // -------------------
  // Adjust to only validate what's needed by backend
  const validationSchema = Yup.object().shape({
    // numeric fields
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

    // contact fields
    contactNumber: Yup.string().required("Contact number is required"),
    mailId: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    address: Yup.string().required("Address is required"),
    receiverName: Yup.string().required("Name is required"),

    // line items
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
  });

  // -------------
  // HANDLE SUBMIT
  // -------------
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Prepare an object to pass into our thunk (NOT FormData here).
    const formValues = {
      tax: values.tax || 0,
      discount: values.discount || 0,
      penalty: values.penalty || 0,
      totalPaidAmount: values.totalPaidAmount || 0,

      govtRefNumber: values.govtRefNumber || "",
      remark: values.remark || "",

      receiver: {
        name: values.receiverName,
        email: values.mailId,
        phone: values.contactNumber,
        address: values.address,
      },

      // Map each item to { revenueType, quantity, total }
      lineItems: values.items.map((item) => ({
        revenueType: item.category,
        quantity: item.quantity,
        total: item.totalAmount,
      })),

      // possible file
      document: values.document,
    };

    // Dispatch createReceipt thunk
    dispatch(createReceipt(formValues))
      .unwrap()
      .then((response) => {
        console.log("Receipt created successfully:", response);
        resetForm(); 
        // If needed, navigate somewhere:
        // navigate('/receipts'); 
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, resetForm, values, setFieldValue }) => (
            <Form id="create-receipt-form">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Create Receipts</h1>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => resetForm()}
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
                      background: "linear-gradient(to right, #ec4899, #a855f7)",
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Receipt"}
                  </button>
                </div>
              </div>

              {/* Receiver Info */}
              <h2 className="text-lg font-semibold mb-4">Receiver Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <TextInput
                  name="receiverName"
                  label="Student Name"
                  placeholder="Enter name"
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
                  label="Email"
                  placeholder="Enter email"
                />
              </div>

              {/* Line Items */}
              <ReturnItems 
                values={values}
                setFieldValue={setFieldValue}
              />

              {/* Tax/Discount/Penalty/Total Paid */}
              <h2 className="text-lg font-semibold mb-4 mt-6">Payment Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <TextInput
                  name="tax"
                  label="Tax"
                  placeholder="Enter tax amount"
                />
                <TextInput
                  name="discount"
                  label="Discount"
                  placeholder="Enter discount"
                />
                <TextInput
                  name="penalty"
                  label="Penalty"
                  placeholder="Enter penalty"
                />
                <TextInput
                  name="totalPaidAmount"
                  label="Total Paid"
                  placeholder="Enter total paid amount"
                />
                <TextInput
                  name="govtRefNumber"
                  label="Government Reference Number"
                  placeholder="Enter reference number"
                />
                <TextInput
                  name="remark"
                  label="Remarks"
                  placeholder="Any remarks here"
                />
                <FileInput
                  name="document"
                  label="Add Document (if any)"
                  placeholder="Upload file"
                  onChange={(e) => {
                    setFieldValue("document", e.currentTarget.files[0]);
                  }}
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
