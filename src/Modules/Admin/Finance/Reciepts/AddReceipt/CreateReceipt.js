import React, { useEffect, useState, useRef } from "react";
import { Formik, Form } from "formik";
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
import { Spin } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"; // Import Ant Design Icons
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";

const CreateReceipt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  useNavHeading("Finance", "Create Receipt");

  const [invoiceNumberInput, setInvoiceNumberInput] = useState(""); // Track invoice input
  const [invoiceStatus, setInvoiceStatus] = useState("idle"); // idle, loading, success, error

  const { invoiceDetails, invoiceFetchSuccess, error } = useSelector(
    (state) => state.admin.invoices
  );

  const formikRef = useRef();

  // Prefill form when invoice details are fetched successfully
  useEffect(() => {
    if (invoiceFetchSuccess && invoiceDetails) {
      const prefilledValues = {
        receiverName: invoiceDetails?.receiver?.name || "",
        mailId: invoiceDetails?.receiver?.email || "",
        contactNumber: invoiceDetails?.receiver?.phone || "",
        address: invoiceDetails?.receiver?.address || "",
        discountType: invoiceDetails?.discountType || "",
        discount: invoiceDetails?.discount || "",
        penalty: invoiceDetails?.penalty || "",
        tax: invoiceDetails?.tax || "",
        govtRefNumber: "",
        remark: "",
        invoiceNumber: invoiceDetails?.invoiceNumber || "",
        items: invoiceDetails?.lineItems?.map((item) => ({
          category: item?.revenueType || "",
          quantity: item?.quantity || "",
          totalAmount: item?.amount || "",
        })) || [{ category: "", quantity: "", totalAmount: "" }],
      };

      formikRef.current.setValues(prefilledValues);
      setInvoiceStatus("success");
      dispatch(clearSelectedInvoiceNumber());
    }
  }, [invoiceFetchSuccess, invoiceDetails, dispatch]);

  // Handle API request for invoice details
  const fetchInvoiceDetails = async (invoiceNumber) => {
    if (invoiceNumber.trim() === "") return;
    setInvoiceStatus("loading");
    try {
      await dispatch(fetchInvoiceByNumber(invoiceNumber)).unwrap();
    } catch {
      setInvoiceStatus("error");
    }
  };

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
    items: [{ category: "", quantity: "", totalAmount: "" }],
  };

  const validationSchema = Yup.object().shape({
    invoiceNumber: Yup.string().required("Invoice number is required"),
    receiverName: Yup.string().required("Name is required"),
    mailId: Yup.string().email("Invalid email address").required("Email is required"),
    contactNumber: Yup.string().required("Contact number is required"),
    address: Yup.string().required("Address is required"),
    discountType: Yup.string().oneOf(["percentage", "amount"]).required("Discount Type is required"),
    discount: Yup.number().min(0, "Discount cannot be negative").required("Discount is required"),
    penalty: Yup.number().min(0, "Penalty cannot be negative").required("Penalty is required"),
    tax: Yup.number().min(0, "Tax cannot be negative").required("Tax is required"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          category: Yup.string().required("Category is required"),
          quantity: Yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
          totalAmount: Yup.number().min(0, "Total Amount cannot be negative").required("Total Amount is required"),
        })
      )
      .min(1, "At least one line item is required"),
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
    };

    dispatch(createReceipt(formValues))
      .unwrap()
      .then(() => {
        resetForm();
        navigate("/finance/receipts/receipt-list");
      })
      .finally(() => setSubmitting(false));
  };

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
                  label="Invoice Number *"
                  placeholder="Enter invoice number"
                  onBlur={() => fetchInvoiceDetails(invoiceNumberInput)} // Fetch details on blur
                  onChange={(e) => {
                    setInvoiceNumberInput(e.target.value);
                    setFieldValue("invoiceNumber", e.target.value); // Update Formik's value
                  }}
                  className="w-full md:w-1/3" // Adjust width
                />
                {/* Status Icon */}
                <div className="absolute top-[2.3rem] right-4">
                  {invoiceStatus === "loading" && <Spin size="small" />}
                  {invoiceStatus === "success" && (
                    <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />
                  )}
                  {invoiceStatus === "error" && (
                    <CloseCircleOutlined style={{ color: "red", fontSize: "20px" }} />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <TextInput
                  name="receiverName"
                  label="Receiver Name *"
                  placeholder="Enter receiver name"
                />
                <TextInput
                  name="address"
                  label="Address *"
                  placeholder="Enter address"
                />
                <TextInput
                  name="contactNumber"
                  label="Contact Number *"
                  placeholder="Enter contact number"
                />
                <TextInput
                  name="mailId"
                  label="Email *"
                  placeholder="Enter email"
                />
              </div>

              {/* Payment Info */}
              <h2 className="text-lg font-semibold mb-4 mt-6">Payment Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <TextInput name="tax" label="Tax *" placeholder="Enter tax" />
                <TextInput
                  name="discount"
                  label="Discount *"
                  placeholder="Enter discount"
                />
                <SelectInput
                  name="discountType"
                  label="Discount Type *"
                  options={[
                    { value: "percentage", label: "Percentage" },
                    { value: "amount", label: "Fixed Amount" },
                  ]}
                />
                <TextInput
                  name="penalty"
                  label="Penalty *"
                  placeholder="Enter penalty"
                />
                <TextInput
                  name="govtRefNumber"
                  label="Government Reference Number"
                  placeholder="Enter reference number"
                />
                <TextInput
                  name="remark"
                  label="Remarks"
                  placeholder="Add remarks"
                />
              </div>

              {/* Items */}
              <h2 className="text-lg font-semibold mb-4">Adjustment Items</h2>
              <ReturnItems values={values} setFieldValue={setFieldValue} />

              {/* Optionally, you can keep the buttons here as well if needed
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-white"
                  style={{
                    background: "linear-gradient(to right, #ec4899, #a855f7)",
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Create Receipt"}
                </button>
              </div>
              */}
            </Form>
          )}
        </Formik>
      </div>
    </DashLayout>
  );
};

export default CreateReceipt;
