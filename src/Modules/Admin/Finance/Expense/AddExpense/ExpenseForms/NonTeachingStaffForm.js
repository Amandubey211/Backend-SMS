import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import PaymentStatus from "../../../Earnings/AddEarnings/Component/PaymentStatus";

const NonTeachingStaffForm = () => {
  const { setFieldValue, values } = useFormikContext();

  // Configuration for Staff Details
  const staffDetailsFields = [
    {
      type: "text",
      label: "Staff Name",
      name: "staffName",
      placeholder: "Enter staff name",
    },
    {
      type: "text",
      label: "Staff ID",
      name: "staffID",
      placeholder: "Enter staff ID",
    },
    {
      type: "text",
      label: "Job Title",
      name: "jobTitle",
      placeholder: "Enter job title",
    },
    {
      type: "select",
      label: "Department",
      name: "department",
      options: ["HR", "Maintenance", "Administration", "Others"],
    },
    {
      type: "text",
      label: "Phone Number",
      name: "phoneNumber",
      placeholder: "Enter phone number",
    },
    {
      type: "text",
      label: "Mail ID",
      name: "email",
      placeholder: "Enter mail ID",
    },
    {
      type: "text",
      label: "Address",
      name: "address",
      placeholder: "Enter address",
    },
  ];

  // Configuration for Bank Details
  const bankDetailsFields = [
    {
      type: "text",
      label: "Account Number",
      name: "accountNumber",
      placeholder: "Enter account number",
    },
    {
      type: "text",
      label: "Account Holder Name",
      name: "accountHolderName",
      placeholder: "Enter Account holder name",
    },
    {
      type: "text",
      label: "IFSC/SWIFT Code",
      name: "ifsc",
      placeholder: "Enter code here",
    },
    {
      type: "text",
      label: "Bank Name",
      name: "bankName",
      placeholder: "Enter Bank name",
    },
    {
      type: "text",
      label: "Branch Name",
      name: "branchName",
      placeholder: "Enter branch name",
    },
  ];

  // Configuration for Salary Details
  const salaryDetailsFields = [
    {
      type: "number",
      label: "Base Salary",
      name: "baseSalary",
      placeholder: "Enter base salary",
    },
    {
      type: "number",
      label: "Tax (Inc/Exc)",
      name: "tax",
      placeholder: "Enter tax percentage",
    },
    {
      type: "number",
      label: "Deduction",
      name: "deduction",
      placeholder: "Enter deduction",
    },
    {
      type: "number",
      label: "Penalty",
      name: "penalty",
      placeholder: "Enter penalty amount",
    },
    {
      type: "number",
      label: "Bonus & Incentives",
      name: "bonus",
      placeholder: "Enter amount",
    },
    {
      type: "number",
      label: "Net salary (After tax/discount/penalty/bonus)",
      name: "netSalary",
      placeholder: "Enter net salary",
    },
    {
      type: "text",
      label: "Recurring Expenses",
      name: "recurringExpenses",
      placeholder: "Enter recurring expenses",
    },
    {
      type: "date",
      label: "Date & Time",
      name: "dateTime",
      placeholder: "Enter date and time",
    },
  ];

  return (
    <>
      {/* Staff Details Section */}
      <FormSection
        title="Staff Details"
        fields={staffDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Staff Bank Details Section */}
      <FormSection
        title="Staff Bank Details"
        fields={bankDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Salary Details Section */}
      <FormSection
        title="Salary Details"
        fields={salaryDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />

      {/* Static Payment Status Section */}
      <PaymentStatus />
    </>
  );
};

export default NonTeachingStaffForm;
