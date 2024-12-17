import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormSection from "../Component/FormSection";
import PaymentDetails from "../Component/PaymentDetails";
import PaymentStatus from "../Component/PaymentStatus";

// Configuration for Staff Details Section
const staffDetailsFields = [
  { name: "staffName", label: "Staff Name", type: "text", placeholder: "Enter staff name" },
  { name: "staffId", label: "Staff ID", type: "text", placeholder: "Enter staff ID" },
  { name: "jobTitle", label: "Job Title", type: "text", placeholder: "Enter job title" },
  { name: "department", label: "Department", type: "select", options: ["HR", "IT", "Finance", "Teaching", "Others"] },
  { name: "phoneNumber", label: "Phone Number", type: "text", placeholder: "Enter phone number" },
  { name: "mailId", label: "Mail ID", type: "text", placeholder: "Enter mail ID" },
  { name: "address", label: "Address", type: "text", placeholder: "Enter address" },
];

// Configuration for Bank Details Section
const bankDetailsFields = [
  { name: "accountNumber", label: "Account Number", type: "text", placeholder: "Enter account number" },
  { name: "accountHolderName", label: "Account Holder Name", type: "text", placeholder: "Enter account holder name" },
  { name: "ifscCode", label: "IFSC/SWIFT Code", type: "text", placeholder: "Enter code here" },
  { name: "bankName", label: "Bank Name", type: "text", placeholder: "Enter bank name" },
  { name: "branchName", label: "Branch Name", type: "text", placeholder: "Enter branch name" },
];

// Configuration for Salary Details Section
const salaryDetailsFields = [
  { name: "recurringExpenses", label: "Recurring Expenses", type: "select", options: ["Monthly", "Quarterly", "Yearly"] },
  { name: "dateTime", label: "Date & Time", type: "datetime-local" },
  { name: "baseSalary", label: "Base Salary", type: "number", placeholder: "Enter base salary" },
  { name: "tax", label: "Tax (Inc/Exc)", type: "number", placeholder: "Enter tax percentage" },
  { name: "deduction", label: "Deduction", type: "number", placeholder: "Enter deduction" },
  { name: "penalty", label: "Penalty", type: "number", placeholder: "Enter penalty amount" },
  { name: "bonus", label: "Bonus & Incentives", type: "number", placeholder: "Enter amount" },
  { name: "netSalary", label: "Net salary (After tax/discount/penalty/bonus)", type: "number", placeholder: "Enter net salary" },
];

// Validation Schema
const validationSchema = Yup.object({
  staffName: Yup.string().required("Staff Name is required"),
  staffId: Yup.string().required("Staff ID is required"),
  jobTitle: Yup.string().required("Job Title is required"),
  department: Yup.string().required("Department is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits"),
  mailId: Yup.string().email("Invalid email format").required("Mail ID is required"),
  address: Yup.string().required("Address is required"),
  accountNumber: Yup.string().required("Account Number is required"),
  accountHolderName: Yup.string().required("Account Holder Name is required"),
  ifscCode: Yup.string().required("IFSC/SWIFT Code is required"),
  bankName: Yup.string().required("Bank Name is required"),
  branchName: Yup.string().required("Branch Name is required"),
  baseSalary: Yup.number().required("Base Salary is required").min(0),
  tax: Yup.number().min(0, "Invalid tax percentage"),
  deduction: Yup.number().min(0, "Invalid deduction amount"),
  penalty: Yup.number().min(0, "Invalid penalty amount"),
  bonus: Yup.number().min(0, "Invalid bonus amount"),
  netSalary: Yup.number().required("Net salary is required").min(0),
});

const TeachingStaffsForm = ({ formData, onFormChange }) => {
  return (
    <Formik
      initialValues={{
        staffName: "",
        staffId: "",
        jobTitle: "",
        department: "",
        phoneNumber: "",
        mailId: "",
        address: "",
        accountNumber: "",
        accountHolderName: "",
        ifscCode: "",
        bankName: "",
        branchName: "",
        recurringExpenses: "",
        dateTime: "",
        baseSalary: "",
        tax: "",
        deduction: "",
        penalty: "",
        bonus: "",
        netSalary: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Submitted Values:", values);
        onFormChange(values);
      }}
    >
      {({ setFieldValue }) => (
        <Form className="bg-white p-6 rounded-lg shadow-md">
          {/* Staff Details Section */}
          <FormSection title="Staff Details" fields={staffDetailsFields} setFieldValue={setFieldValue} />

          {/* Staff Bank Details Section */}
          <FormSection title="Staff Bank Details" fields={bankDetailsFields} setFieldValue={setFieldValue} />

          {/* Salary Details Section */}
          <FormSection title="Salary Details" fields={salaryDetailsFields} setFieldValue={setFieldValue} />

          {/* Payment Status Section */}
          <PaymentStatus setFieldValue={setFieldValue} />
        </Form>
      )}
    </Formik>
  );
};

export default TeachingStaffsForm;
