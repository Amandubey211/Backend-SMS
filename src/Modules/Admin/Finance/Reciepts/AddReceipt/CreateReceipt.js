// src/Modules/Admin/Finance/Receipts/AddReceipt/CreateReceipt.js

import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik"; // Import Field and ErrorMessage
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import InvoiceTextInput from "./Components/InvoiceTextInput";
import ReturnItems from "./Components/ReturnItems";
import SelectInput from "../../PenaltiesandAdjustments/AddPenaltyAdjustment/Components/SelectInput";
import { fetchInvoiceByNumber } from "../../../../../Store/Slices/Finance/Invoice/invoice.thunk";
import { clearSelectedInvoiceNumber } from "../../../../../Store/Slices/Finance/Invoice/invoiceSlice";
import { createReceipt } from "../../../../../Store/Slices/Finance/Receipts/receiptsThunks";
import useDebounce from "../../../../../Hooks/CommonHooks/useDebounce";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";

// Define calculateFinalAmounts function
const calculateFinalAmounts = (data) => {
  const { total_amount, discountType, discount, tax, penalty, paid_amount, advance_amount } = data;

  // Calculate discount
  let discountValue = 0;
  if (discountType === 'percentage') {
    discountValue = (total_amount * discount) / 100;
  } else if (discountType === 'amount') {
    discountValue = discount;
  }

  // Ensure discount does not exceed the total amount
  discountValue = Math.min(discountValue, total_amount);

  // Round discount value to 2 decimal places
  discountValue = parseFloat(discountValue.toFixed(2));

  // Calculate total with tax
  const totalWithTax = parseFloat((total_amount + (total_amount * tax) / 100).toFixed(2));

  // Calculate the final amount
  const finalAmount = parseFloat((totalWithTax - discountValue + penalty).toFixed(2));

  // Combine paid_amount and advance_amount
  let totalPaid = paid_amount + (advance_amount || 0);

  let remainingAmount = 0;
  let advanceAmount = advance_amount || 0;

  if (totalPaid >= finalAmount) {
    // If total paid exceeds finalAmount
    advanceAmount = parseFloat((totalPaid - finalAmount).toFixed(2));
    totalPaid = finalAmount; // Cap paid_amount to finalAmount
    remainingAmount = 0;
  } else {
    // Calculate remaining amount
    remainingAmount = parseFloat((finalAmount - totalPaid).toFixed(2));
    advanceAmount = 0; // No surplus in advance
  }

  return {
    discountValue,
    finalAmount,
    remainingAmount,
    advanceAmount,
    totalPaid,
  };
};

// Define CalculateAmounts component
const CalculateAmounts = () => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    // Calculate total_amount from items
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
  }, [values.items, values.discountType, values.discount, values.tax, values.penalty, setFieldValue]);

  return null; // This component doesn't render anything
};

const CreateReceipt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  useNavHeading("Finance", "Create Receipt");

  const [invoiceNumberInput, setInvoiceNumberInput] = useState(""); // Track invoice input
  const debouncedInvoiceNumber = useDebounce(invoiceNumberInput, 500);

  // Destructure the necessary state
  const { invoiceDetails, invoiceFetchSuccess, error, selectedInvoiceNumber } = useSelector(
    (state) => state.admin.invoices
  );

  const formikRef = useRef();

  // Prefill form when invoice details are fetched successfully
  useEffect(() => {
    if (invoiceFetchSuccess && invoiceDetails) {
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
        invoiceNumber: invoiceDetails?.invoiceNumber || "",
        items:
          invoiceDetails?.lineItems?.map((item) => ({
            category: item?.revenueType || "",
            quantity: item?.quantity || 0,
            totalAmount: item?.amount || 0,
            subCategory: item?.revenueReference?.subCategory || "",
            stationeries: item?.revenueReference?.stationeryItems?.map((stationery) => ({
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
      };

      formikRef.current.setValues(prefilledValues);
      dispatch(clearSelectedInvoiceNumber());
    }
  }, [invoiceFetchSuccess, invoiceDetails, dispatch]);

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
    items: [{ category: "", quantity: "", totalAmount: "" }],
    subAmount: 0, // Initialize subAmount
    finalAmount: 0, // Initialize finalAmount
  };

  const validationSchema = Yup.object().shape({
    invoiceNumber: Yup.string().required("Invoice number is required"),
    receiverName: Yup.string().required("Name is required"),
    mailId: Yup.string().email("Invalid email address").required("Email is required"),
    contactNumber: Yup.string().required("Contact number is required"),
    address: Yup.string().required("Address is required"),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"], "Discount Type must be 'percentage' or 'amount'")
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
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
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
    };

    dispatch(createReceipt(formValues))
      .unwrap()
      .then(() => {
        resetForm();
        navigate("/finance/receipts/receipt-list");
      })
      .finally(() => setSubmitting(false));
  };

  // Fetch invoice details when debounced invoice number changes and is valid
  useEffect(() => {
    const invoiceNumberPattern = /^INV\d{4}-\d{6}-\d{4}$/; // Adjust regex based on exact format
    if (debouncedInvoiceNumber && invoiceNumberPattern.test(debouncedInvoiceNumber)) {
      dispatch(fetchInvoiceByNumber(debouncedInvoiceNumber));
    } else if (debouncedInvoiceNumber === "") {
      // Optionally handle empty input by resetting the form
      if (formikRef.current) {
        formikRef.current.setValues(blankInitialValues);
      }
    }
  }, [debouncedInvoiceNumber, dispatch]);

  // Reset form fields when there's an error fetching invoice
  useEffect(() => {
    if (error) {
      if (formikRef.current) {
        formikRef.current.resetForm({
          values: {
            ...blankInitialValues,
            invoiceNumber: invoiceNumberInput, // Preserve the invoice number
          },
        });
      }
    }
  }, [error, blankInitialValues, invoiceNumberInput]);

  return (
    <DashLayout>
      <div className="p-6 min-h-screen">
        <Formik
          innerRef={formikRef}
          initialValues={blankInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue, resetForm }) => (
            <Form>
              {/* Calculate and update subAmount and finalAmount */}
              <CalculateAmounts />

              {/* Header with Buttons */}
              <div className="flex justify-end mb-2 space-x-4">
                <button
                  type="reset"
                  onClick={resetForm}
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
              </div>

              {/* Receiver Details */}
              <h2 className="text-lg font-semibold mb-4">Receiver Details</h2>
              {/* Invoice Number */}
              <div className="relative mb-6">
                <InvoiceTextInput
                  name="invoiceNumber"
                  label="Invoice Number"
                  placeholder="Enter invoice number (e.g., INV0003-202412-0001)"
                  required
                  type="text"
                  value={invoiceNumberInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInvoiceNumberInput(value);
                    setFieldValue("invoiceNumber", value); // Update Formik's value

                    // Reset form fields if invoice number changes
                    if (value !== selectedInvoiceNumber) {
                      setFieldValue("receiverName", "");
                      setFieldValue("mailId", "");
                      setFieldValue("contactNumber", "");
                      setFieldValue("address", "");
                      setFieldValue("discountType", "amount");
                      setFieldValue("discount", 0);
                      setFieldValue("penalty", 0);
                      setFieldValue("tax", 0);
                      setFieldValue("govtRefNumber", "");
                      setFieldValue("remark", "");
                      setFieldValue("items", [
                        {
                          category: "",
                          revenueReference: "",
                          quantity: "",
                          totalAmount: "",
                        },
                      ]);
                      setFieldValue("subAmount", 0, false);
                      setFieldValue("finalAmount", 0, false);
                    }
                  }}
                  // Removed the onBlur prop
                />
                {/* Removed the separate Status Icon div */}
              </div>

              {/* Receiver Details Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <TextInput
                  name="receiverName"
                  label="Receiver Name"
                  placeholder="Enter receiver name"
                  required
                />
                <TextInput
                  name="address"
                  label="Address"
                  placeholder="Enter address"
                  required
                />
                <TextInput
                  name="contactNumber"
                  label="Contact Number"
                  placeholder="Enter contact number"
                  required
                />
                <TextInput
                  name="mailId"
                  label="Email"
                  placeholder="Enter email"
                  required
                />
              </div>

              {/* Items */}
              <h2 className="text-lg font-semibold mb-4">Adjustment Items</h2>
              <ReturnItems values={values} setFieldValue={setFieldValue} />

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
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  <ErrorMessage
                    name="tax"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <TextInput name="discount" label="Discount" placeholder="Enter discount" required />

                <SelectInput
                  name="discountType"
                  label="Discount Type"
                  options={[
                    { value: "percentage", label: "Percentage" },
                    { value: "amount", label: "Fixed Amount" },
                  ]}
                />

                {/* Sub Amount (Read-only) */}
                <TextInput
                  name="subAmount"
                  label="Sub Amount"
                  placeholder="Sub Amount"
                  type="number"
                  disabled
                />

                <TextInput name="penalty" label="Penalty" placeholder="Enter penalty" required />

                <TextInput
                  name="govtRefNumber"
                  label="Government Reference Number"
                  placeholder="Enter reference number"
                />

                <TextInput name="remark" label="Remarks" placeholder="Add remarks" />

                {/* Final Amount (Read-only) */}
                <TextInput
                  name="finalAmount"
                  label="Final Amount"
                  placeholder="Final Amount"
                  type="number"
                  disabled
                />
              </div>

              {/* Display Error Messages */}
              {error && <div className="text-red-500 mb-4">{error}</div>}
              {/* Optionally, add success messages if needed */}
            </Form>
          )}
        </Formik>
      </div>
    </DashLayout>
  );
};

export default CreateReceipt;
