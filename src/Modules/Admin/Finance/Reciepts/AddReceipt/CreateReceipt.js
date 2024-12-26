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
  const [selectedSection, setSelectedSection] = useState("");

  // Accessing Redux State with Default Values to Prevent Destructuring Errors
  const { classes = [] } = useSelector((store) => store?.admin?.class || {});
  const { sectionsList = {} } = useSelector((store) => store?.admin?.group_section || {});
  const { studentsList = {} } = useSelector((store) => store?.admin?.students || {});

  // Fetch classes on component mount
  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

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
    academicYear: "", // You can set a default value if needed
    items: [{ category: "", quantity: 1, rate: 0, totalAmount: 0 }],
    billingPeriod: "",
    dueDate: "",
    subAmount: 0,
    tax: 0,
    discount: 0,
    penalty: 0,
    finalAmount: 0,
    governmentRefNumber: "",
    document: null,
    paymentMode: "",
    paymentStatus: "",
    remainingAmount: 0,
    remarks: "",
  };

  const validationSchema = Yup.object().shape({
    studentName: Yup.string().required("Student Name is required"),
    class: Yup.string().required("Class is required"),
    section: Yup.string().required("Section is required"),
    admissionNumber: Yup.string().required("Admission Number is required"),
    parentName: Yup.string().required("Parent Name is required"),
    contactNumber: Yup.string().required("Contact Number is required"),
    mailId: Yup.string().email("Invalid email").required("Mail ID is required"),
    academicYear: Yup.string().required("Academic Year is required"),
    items: Yup.array().of(
      Yup.object().shape({
        category: Yup.string().required("Category is required"),
        quantity: Yup.number().min(1, "Quantity must be at least 1"),
        rate: Yup.number().min(0, "Rate must be positive"),
      })
    ),
    dueDate: Yup.string().required("Due Date is required"),
    finalAmount: Yup.number().min(0, "Final amount must be positive"),
    remainingAmount: Yup.number().min(0, "Remaining amount must be positive"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Prepare form data to match backend requirements
    const formData = new FormData();

    // Get schoolId from localStorage
    const schoolId = localStorage.getItem('schoolId');

    // Append basic fields
    formData.append('receiptNumber', values.receiptNumber || ""); // If auto-generated, can omit
    formData.append('tax', values.tax);
    formData.append('discount', values.discount);
    formData.append('penalty', values.penalty);
    formData.append('totalPaidAmount', values.finalAmount); // Assuming finalAmount is the total paid
    formData.append('receiver', JSON.stringify({
      name: values.studentName,
      email: values.mailId,
      phone: values.contactNumber,
      address: values.address,
    }));
    formData.append('govtRefNumber', values.governmentRefNumber);
    formData.append('remark', values.remarks);
    formData.append('schoolName', ""); // This will be handled in the backend based on schoolId
    formData.append('schoolId', schoolId);
    formData.append('academicYear', values.academicYear);

    // Append line items
    formData.append('lineItems', JSON.stringify(values.items.map(item => ({
      revenueType: item.category,
      quantity: item.quantity,
      total: item.totalAmount,
      // record_id: item.record_id, // If applicable
    }))));

    // Append billing details
    formData.append('billingPeriod', values.billingPeriod);
    formData.append('dueDate', values.dueDate);
    formData.append('subAmount', values.subAmount);
    formData.append('finalAmount', values.finalAmount);
    formData.append('remainingAmount', values.remainingAmount);
    formData.append('paymentMode', values.paymentMode);
    formData.append('paymentStatus', values.paymentStatus);

    // Append document if exists
    if (values.document) {
      formData.append('document', values.document);
    }

    // Dispatch createReceipt thunk
    dispatch(createReceipt(formData))
      .unwrap()
      .then((response) => {
        // Assuming thunks handle toast notifications
        resetForm();
        // Optionally navigate or show success message
      })
      .catch((err) => {
        // Errors are handled in thunks
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <DashLayout>
      <div className="p-6 min-h-screen">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Create Receipts</h1>
          <div className="flex gap-4">
            <button
              type="reset"
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
              form="create-receipt-form"
              className="px-4 py-2 rounded-md text-white"
              style={{
                background: "linear-gradient(to right, #ec4899, #a855f7)", // from-pink-500 to-purple-500
              }}
              disabled={false} // Optionally, disable during submission
            >
              Save Receipts
            </button>
          </div>
        </div>

        {/* Form Section */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form id="create-receipt-form">
              {/* Notes Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <TextInput
                  name="notes"
                  label="Notes"
                  placeholder="Write notes here"
                />
              </div>

              {/* Bill To Section */}
              <h2 className="text-lg font-semibold mb-4">Bill To</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <SelectInput
                  name="class"
                  label="Class"
                  options={classes.map((cls) => ({ label: cls.className, value: cls._id }))} // Map classes to dropdown options
                  onChange={(e) => {
                    const classId = e.target.value;
                    console.log("Class selected:", classId); // Debugging
                    setFieldValue("class", classId);
                    setSelectedClass(classId);
                    setFieldValue("studentName", ""); // Reset student name when class changes

                    // Debug payload
                    const payload = { classId: String(classId), sectionId: "" };
                    console.log("Dispatching fetchStudentsByClassAndSection with payload:", payload);

                    // Dispatch the action
                    dispatch(fetchStudentsByClassAndSection(payload.classId))
                      .unwrap()
                      .then((response) => {
                        console.log("Response received:", response); // Debug the API response
                        console.log("Students fetched successfully for class:", classId); // Success Debugging
                      })
                      .catch((error) => {
                        console.error("Failed to fetch students:", error); // Error Debugging
                      });
                  }}
                />

                {/* Student Name Selection */}
                <SelectInput
                  name="studentName"
                  label="Student Name"
                  options={
                    Array.isArray(studentsList) // Ensure studentsList is an array
                      ? studentsList.map((student) => {
                        console.log("Mapping student:", student); // Debugging individual student object
                        return {
                          label: `${student.firstName} ${student.lastName}`, // Combine first name and last name
                          value: student._id, // Use student ID as the value
                        };
                      })
                      : []
                  }
                  onChange={(e) => {
                    const studentId = e.target.value;
                    console.log("Student selected:", studentId); // Debugging
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
                  label="Tax (Inc/Exc)"
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
                  label="Final Amount (After tax/discount/penalty)"
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
                  setFieldValue={setFieldValue}
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
            </Form>
          )}
        </Formik>
      </div>
    </DashLayout>
  );
};

export default CreateReceipt;
