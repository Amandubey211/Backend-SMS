import React, { useState, useEffect } from "react";
import { Formik, Form, FieldArray, useFormikContext } from "formik";
import * as Yup from "yup";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import SelectInput from "./Components/SelectInput";
import FileInput from "./Components/FileInput";
import { useDispatch, useSelector } from "react-redux";
import { addQuotation } from "../../../../../Store/Slices/Finance/Quotations/quotationThunks";
import toast from "react-hot-toast";
import Layout from "../../../../../Components/Common/Layout";
import { useNavigate } from "react-router-dom";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading "; // Removed trailing space
import { Descriptions } from "antd";

/**
 * Inner form component using useFormikContext
 * to handle real-time calculation of Sub Amount and Final Amount.
 */
const QuotationFormInner = ({ readOnly, loading, formattedQuotation }) => {
  const { values, setFieldValue, resetForm, isSubmitting } = useFormikContext();
  
  
  // Auto-calculate sub_amount (total_amount) and final_amount in real-time
  useEffect(() => {
    // Calculate subAmount from lineItems
    const updatedLineItems = values.lineItems?.map((item, index) => {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.amount) || 0;
      const amount = quantity * rate;

      // Update amount in each line item
      setFieldValue(`lineItems.${index}.quantityAmount`, amount, false);
      return amount;
    });

    const subAmount = updatedLineItems?.reduce((acc, curr) => acc + curr, 0) || 0;

    // Convert tax and discount to number
    const taxValue = parseFloat(values.tax) || 0;
    const discountValue = parseFloat(values.discount) || 0;

    let calculatedFinal = subAmount;

    // If tax is a percentage
    if (taxValue) {
      calculatedFinal += (calculatedFinal * taxValue) / 100;
    }

    // Apply discount
    if (discountValue) {
      if (values.discountType === "percentage") {
        calculatedFinal -= (calculatedFinal * discountValue) / 100;
      } else {
        calculatedFinal -= discountValue;
      }
    }

    // Ensure amounts don’t go below zero
    setFieldValue("total_amount", subAmount < 0 ? 0 : subAmount, false);
    setFieldValue("final_amount", calculatedFinal < 0 ? 0 : calculatedFinal, false);

  }, [values.lineItems, values.tax, values.discount, values.discountType, setFieldValue]);


  return (
    <Form>
      <div className="flex justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">
          {readOnly ? "View Quotation" : ""}
        </h1>
        {!readOnly && (
          <div className="gap-4">
            <button
              type="button"
              onClick={() => resetForm({ values: formattedQuotation })}
              className="border border-gray-300 text-gray-700 px-4 py-2 mx-2 rounded-md hover:bg-gray-100"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="px-4 py-2 rounded-md text-white"
              style={{
                background: "linear-gradient(to right, #ec4899, #a855f7)",
              }}
            >
              {loading ? "Loading.." : "Save Quotation"}
            </button>
          </div>
        )}
      </div>

      {/* Quotation To Section */}
      <h2 className="text-lg font-semibold mb-4">Quotation To</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <TextInput
          name="receiver.name"
          label="Receiver Name"
          placeholder="Enter receiver's name"
          required={true}
          readOnly={readOnly}
          disabled={readOnly}
        />
        <TextInput
          name="receiver.address"
          label="Address"
          placeholder="Enter Address"
          readOnly={readOnly}
          disabled={readOnly}
        />
        <TextInput
          name="receiver.phone"
          label="Contact Number"
          placeholder="Enter contact number"
          readOnly={readOnly}
          disabled={readOnly}
        />
        <TextInput
          name="receiver.email"
          label="Email Id"
          placeholder="Enter receiver's email"
          readOnly={readOnly}
          disabled={readOnly}
        />
        <TextInput
          name="purpose"
          label="Purpose"
          placeholder="Enter purpose"
          required={true}
          readOnly={readOnly}
          disabled={readOnly}
        />
        <TextInput
          name="date"
          label="Quotation Date"
          placeholder="Enter date"
          type="date"
          required={true}
          readOnly={readOnly}
          disabled={readOnly}
        />
      </div>

      {/* Items Section */}
      <div
        className="p-4 rounded-md flex flex-col items-center justify-center mb-7"
        style={{ backgroundColor: "#ECECEC" }}
      >
        <h2 className="text-lg font-semibold mb-4">Items</h2>
        <FieldArray name="lineItems">
          {({ remove, push }) => (
            <>
              {values.lineItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center mb-6">
                  <div className="col-span-3">
                    <TextInput
                      name={`lineItems.${index}.category`}
                      label="Category"
                      type="text"
                      placeholder="Enter Category"
                      readOnly={readOnly}
                      disabled={readOnly}
                    />
                  </div>

                  <div className="col-span-3">
                    <TextInput
                      name={`lineItems.${index}.description`}
                      label="Description"
                      type="text"
                      placeholder="Enter Description"
                      readOnly={readOnly}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="col-span-1">
                    <TextInput
                      name={`lineItems.${index}.quantity`}
                      label="Quantity"
                      type="number"
                      placeholder="Enter Quantity"
                      required={true}
                      readOnly={readOnly}
                      disabled={readOnly}
                    />
                  </div>

                  <div className="col-span-1">
                    <TextInput
                      name={`lineItems.${index}.amount`}
                      label="Rate (QAR)"
                      type="number"
                      placeholder="Enter Amount"
                      required={true}
                      readOnly={readOnly}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="col-span-2">
                    <TextInput
                      name={`lineItems.${index}.quantityAmount`}
                      label="Amount  (QAR)"
                      type="number"
                      placeholder={0}
                      required={true}
                      readOnly={true}
                      disabled={true}
                    />
                  </div>

                  <div className="col-span-1 flex items-center justify-center">
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 text-lg"
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
                    onClick={() => push({ revenueType: "", quantity: 1, amount: 0 })}
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
      </div>

      {/* Additional Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <TextInput
          name="dueDate"
          label="Due date"
          placeholder="Enter Due date"
          type="date"
          readOnly={readOnly}
          disabled={readOnly}
        />

        <TextInput
          name="tax"
          label="Tax (Inc/Exc)"
          placeholder="Enter tax percentage"
          required={true}
          readOnly={readOnly}
          disabled={readOnly}
        />

        <SelectInput
          name="discountType"
          label="Discount Type"
          options={[
            { label: "Percentage", value: "percentage" },
            { label: "Amount", value: "amount" },
          ]}
          required={true}
          readOnly={readOnly}
          disabled={readOnly}
        />

        <TextInput
          name="discount"
          label={`Discount (${values.discountType === "percentage" ? "%" : "Amount"})`}
          placeholder={`Enter discount ${values.discountType}`}
          type="number"
          required={true}
          readOnly={readOnly}
          disabled={readOnly}
        />

        <SelectInput
          name="status"
          label="Status"
          options={[
            { label: "Pending", value: "pending" },
            { label: "Accept", value: "accept" },
            { label: "Reject", value: "reject" },
          ]}
          required={true}
          readOnly={readOnly}
          disabled={readOnly}
        />

        <TextInput
          name="govtRefNumber"
          label="Govt Reference Number"
          placeholder="Enter Govt Reference Number"
          readOnly={readOnly}
          disabled={readOnly}
        />

        <FileInput
          name="document"
          label="Add Document (if any)"
          placeholder="Upload file"
          onChange={(e) => {
            // Example file handling: if you use an upload service, replace this with the URL returned
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              // For demonstration, we use the file name. In real code, you might upload the file and use its URL.
              setFieldValue("document", file.name);
            }
          }}
          value={values.document}
          readOnly={readOnly}
          disabled={readOnly}
        />

        <TextInput
          name="remark"
          label="Remark"
          placeholder="Enter remark (if any)"
          readOnly={readOnly}
          disabled={readOnly}
        />

        {/* Auto-calculated fields */}
        <TextInput
          name="total_amount"
          label="Sub Amount (QAR)"
          placeholder="Auto-calculated sub total"
          readOnly={true}
          disabled={true}
        />
        <TextInput
          name="final_amount"
          label="Final Amount (After tax/discount)"
          placeholder="Auto-calculated final amount"
          readOnly={true}
          disabled={true}
        />
      </div>
    </Form>
  );
};

const CreateQuotation = () => {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  };

  const [loading, setLoading] = useState(false);
  const { readOnly, selectedQuotation } = useSelector(
    (state) => state.admin.quotations
  );
  const navigate = useNavigate();
  useNavHeading("Finance", "Create Quotations");

  const validationSchema = Yup.object().shape({
    receiver: Yup.object().shape({
      name: Yup.string().required("Receiver Name is required"),
      email: Yup.string().email("Invalid email"),
    }),
    purpose: Yup.string().required("Purpose is required"),
    lineItems: Yup.array().of(
      Yup.object().shape({
        revenueType: Yup.string().required("Revenue Type is required"),
        subCategory: Yup.string().required("Revenue Type is required"),
        description: Yup.string(),
        quantity: Yup.number().min(1).required("required"),
        amount: Yup.number().min(0, "positive").required("required"),
        quantityAmount: Yup.number().min(0, "positive").required("required"),
      })
    ),
    discountType: Yup.string()
      .oneOf(["percentage", "amount"], "Invalid discount type")
      .required("Discount type is required"),
    discount: Yup.number()
      .min(0, "Discount must be positive")
      .required("Discount is required"),
    date: Yup.string().required("Quotation Date is required"),
    final_amount: Yup.number().min(0, "Final amount must be positive"),
    remainingAmount: Yup.number().min(0, "Remaining amount must be positive"),
    document: Yup.string().nullable(),
    tax: Yup.number().min(0, "Tax must be positive").nullable(),
  });

  const dispatch = useDispatch();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (readOnly) return;
    console.log("Submitting values:", values); // Debug log
    setLoading(true);
    try {
      await dispatch(addQuotation(values)).unwrap();
      toast.success("Quotation created successfully!");
      resetForm();
      navigate("/finance/quotations/quotations-list");
    } catch (error) {
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // Prepare initial values
  const formattedQuotation = {
    receiver: selectedQuotation?.receiver || {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
    lineItems:
      selectedQuotation?.lineItems || [
        { revenueType: "", subCategory: "", description: "", quantity: 1, amount: 0, },
      ],
    date: selectedQuotation?.date
      ? formatDate(selectedQuotation.date)
      : formatDate(new Date()),
    dueDate: selectedQuotation?.dueDate
      ? formatDate(selectedQuotation.dueDate)
      : formatDate(new Date()),
    purpose: selectedQuotation?.purpose || "",
    status: selectedQuotation?.status || "pending",
    total_amount: selectedQuotation?.total_amount || 0,
    tax: selectedQuotation?.tax || 0,
    discountType: selectedQuotation?.discountType || "percentage",
    discount: selectedQuotation?.discount || 0,
    final_amount: selectedQuotation?.final_amount || 0,
    document: selectedQuotation?.document || null,
    paymentMode: selectedQuotation?.paymentMode || "",
    paymentStatus: selectedQuotation?.paymentStatus || "",
    remainingAmount: selectedQuotation?.remainingAmount || 0,
    remark: selectedQuotation?.remark || "",
    govtRefNumber: selectedQuotation?.govtRefNumber || "",
  };

  console.log("Initial Values:", formattedQuotation);

  return (
    <Layout>
      <DashLayout>
        <div className="p-6 min-h-screen">
          {readOnly && (
            <div className="bg-yellow-100 text-yellow-900 px-4 py-2 rounded-md mb-4">
              Currently in read-only mode. You cannot edit these fields.
            </div>
          )}

          <Formik
            initialValues={formattedQuotation}
            validationSchema={!readOnly ? validationSchema : null}
            onSubmit={handleSubmit}
          >
            <QuotationFormInner
              readOnly={readOnly}
              loading={loading}
              formattedQuotation={formattedQuotation}
            />
          </Formik>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default CreateQuotation;
