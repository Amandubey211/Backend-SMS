// CreateReceipt.js
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import TextInput from "./Components/TextInput";
import SelectInput from "./Components/SelectInput";
import ReturnItems from "./Components/ReturnItems";
import FileInput from "./Components/FileInput";
import { fetchAllClasses } from "../../../../../Store/Slices/Admin/Class/actions/classThunk";
import { fetchStudentsByClassAndSection } from "../../../../../Store/Slices/Admin/Class/Students/studentThunks";
import { createReceipt } from "../../../../../Store/Slices/Finance/Receipts/receiptsThunks";

const CreateReceipt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedClass, setSelectedClass] = useState("");

  // Accessing Redux State with Default Values to Prevent Destructuring Errors
  const { classes = [] } = useSelector((store) => store?.admin?.class || {});
  const { studentsList = [] } = useSelector((store) => store?.admin?.students || {});

  // Fetch classes on component mount
  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  // Revised Initial Values: No pre-filled or zero values
  const initialValues = {
    notes: "",
    class: "",
    section: "",
    studentName: "",
    admissionNumber: "",
    parentName: "",
    address: "",
    contactNumber: "",
    mailId: "",
    items: [{ category: "", quantity: "", rate: "", totalAmount: "" }], // Empty strings instead of zeros
    billingPeriod: "",
    dueDate: "",
    subAmount: "",
    tax: "",
    discount: "",
    penalty: "",
    finalAmount: "",
    governmentRefNumber: "",
    document: null,
    paymentMode: "",
    paymentStatus: "",
    remainingAmount: "",
    remarks: "",
  };

  // Revised Validation Schema: Only backend-required fields are required
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
    finalAmount: Yup.number()
      .typeError("Final amount must be a number")
      .min(0, "Final amount must be positive")
      .required("Final amount is required"),
    contactNumber: Yup.string().required("Contact Number is required"),
    mailId: Yup.string()
      .email("Invalid email")
      .required("Mail ID is required"),
    address: Yup.string().required("Address is required"),
    studentName: Yup.string().required("Student Name is required"),
    // Line Items Validation
    items: Yup.array()
      .of(
        Yup.object().shape({
          category: Yup.string().required("Category is required"),
          quantity: Yup.number()
            .typeError("Quantity must be a number")
            .min(1, "Quantity must be at least 1")
            .required("Quantity is required"),
          rate: Yup.number()
            .typeError("Rate must be a number")
            .min(0, "Rate must be positive")
            .required("Rate is required"),
          // totalAmount is calculated, so it can be optional
        })
      )
      .min(1, "At least one item is required"),
    dueDate: Yup.string().required("Due Date is required"),
    // Optional fields can have their own validations or be left out
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log("Form Submitted with values:", values);
    // Prepare form data to match backend requirements
    const formData = new FormData();

    // Get schoolId from localStorage
    const schoolId = localStorage.getItem('schoolId');

    // Append basic fields
    // Note: receiptNumber and schoolName are handled by the backend
    formData.append('tax', values.tax || "0");
    formData.append('discount', values.discount || "0");
    formData.append('penalty', values.penalty || "0");
    formData.append('totalPaidAmount', values.finalAmount || "0"); // Assuming finalAmount is the total paid
    formData.append('receiver', JSON.stringify({
      name: values.studentName,
      email: values.mailId,
      phone: values.contactNumber,
      address: values.address,
    }));
    formData.append('govtRefNumber', values.governmentRefNumber || "");
    formData.append('remark', values.remarks || "");
    // schoolName is handled in the backend based on schoolId
    formData.append('schoolId', schoolId);

    // Append line items
    formData.append('lineItems', JSON.stringify(values.items.map(item => ({
      revenueType: item.category,
      quantity: item.quantity,
      total: item.totalAmount || 0, // Default to 0 if not provided
      // record_id: item.record_id, // If applicable
    }))));

    // Append other billing details if needed
    formData.append('billingPeriod', values.billingPeriod || "");
    formData.append('dueDate', values.dueDate);
    formData.append('subAmount', values.subAmount || "0");
    formData.append('finalAmount', values.finalAmount || "0");
    formData.append('remainingAmount', values.remainingAmount || "0");
    formData.append('paymentMode', values.paymentMode || "");
    formData.append('paymentStatus', values.paymentStatus || "");

    // Append document if exists
    if (values.document) {
      formData.append('document', values.document);
    }

    // Dispatch createReceipt thunk
    dispatch(createReceipt(formData))
      .unwrap()
      .then((response) => {
        console.log("Receipt created successfully:", response);
        resetForm(); // Reset the form to initial empty values
        // Optionally navigate or show success message
        // navigate('/receipts'); // Example navigation
      })
      .catch((err) => {
        console.error("Error creating receipt:", err);
        // Errors are handled in thunks
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <DashLayout>
      <div className="p-6 min-h-screen">
        {/* Formik wraps the entire form including the header for proper access to Formik's methods */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting, resetForm }) => (
            <Form id="create-receipt-form">
              {/* Header Section */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Create Receipts</h1>
                <div className="flex gap-4">
                  {/* Reset Button using Formik's resetForm */}
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
                    {isSubmitting ? "Creating..." : "Create Receipts"}
                  </button>
                </div>
              </div>

              {/* Bill To Section */}
              <h2 className="text-lg font-semibold mb-4">Bill To</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <SelectInput
                  name="class"
                  label="Class"
                  options={classes.map((cls) => ({ label: cls.className, value: cls._id }))}
                  onChange={(e) => {
                    const classId = e.target.value;
                    setSelectedClass(classId);
                    setFieldValue("studentName", ""); // Reset student name when class changes

                    // Dispatch the action to fetch students based on class
                    dispatch(fetchStudentsByClassAndSection(classId))
                      .unwrap()
                      .then((response) => {
                        // Handle successful fetch if needed
                      })
                      .catch((error) => {
                        console.error("Failed to fetch students:", error);
                      });
                  }}
                />

                {/* Student Name Selection */}
                <SelectInput
                  name="studentName"
                  label="Student Name"
                  options={
                    Array.isArray(studentsList)
                      ? studentsList.map((student) => ({
                        label: `${student.firstName} ${student.lastName}`,
                        value: student._id,
                      }))
                      : []
                  }
                  onChange={(e) => {
                    const studentId = e.target.value;
                    setFieldValue("studentName", studentId);
                  }}
                  disabled={
                    !selectedClass || !Array.isArray(studentsList) || studentsList.length === 0
                  }
                />

                {/* Address */}
                <TextInput
                  name="address"
                  label="Address"
                  placeholder="Enter address"
                />

                {/* Contact Number */}
                <TextInput
                  name="contactNumber"
                  label="Contact Number"
                  placeholder="Enter contact number"
                />

                {/* Mail ID */}
                <TextInput
                  name="mailId"
                  label="Mail ID"
                  placeholder="Enter mail ID"
                />
              </div>

              {/* Return Items */}
              <ReturnItems values={values} setFieldValue={setFieldValue} />

              {/* Payment Details */}
              <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <SelectInput
                  name="billingPeriod"
                  label="Billing Period"
                  options={["Monthly", "Quarterly", "Yearly"].map(option => ({ label: option, value: option }))}
                />
                <TextInput
                  name="dueDate"
                  label="Due Date"
                  type="date"
                  placeholder="Enter date"
                />
                <TextInput
                  name="subAmount"
                  label="Sub Amount"
                  placeholder="Enter sub total"
                />
                <TextInput
                  name="tax"
                  label="Tax"
                  placeholder="Enter tax percentage"
                />
                <TextInput
                  name="discount"
                  label="Discount"
                  placeholder="Enter discount"
                />
                <TextInput
                  name="penalty"
                  label="Penalty"
                  placeholder="Enter penalty amount"
                />
                <TextInput
                  name="finalAmount"
                  label="Final Amount"
                  placeholder="Enter final amount"
                  readOnly
                />
                <TextInput
                  name="governmentRefNumber"
                  label="Government Refer Number"
                  placeholder="Enter here"
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

              {/* Payment Status */}
              <h2 className="text-lg font-semibold mb-4">Payment Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectInput
                  name="paymentMode"
                  label="Payment Mode"
                  options={["Cash", "Card", "Bank Transfer"].map(option => ({ label: option, value: option }))}
                />
                <SelectInput
                  name="paymentStatus"
                  label="Payment Status"
                  options={["Paid", "Unpaid", "Partial"].map(option => ({ label: option, value: option }))}
                />
                <TextInput
                  name="remarks"
                  label="Remarks (If Any)"
                  placeholder="Enter remarks here"
                />
              </div>
              {/* Notes Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <TextInput
                  name="notes"
                  label="Notes"
                  placeholder="Write notes here"
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
