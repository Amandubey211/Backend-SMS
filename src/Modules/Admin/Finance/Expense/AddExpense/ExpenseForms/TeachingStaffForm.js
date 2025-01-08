import React from "react";
import { useFormikContext } from "formik";
import StaffSelect from "../Components/StaffSelect";
import TransactionDetails from "../Components/TransactionDetails";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";

const TeachingStaffForm = () => {
  const { setFieldValue, values } = useFormikContext();
  // Recurring Expense Fields
  const recurringFields = [
    {
      type: "checkbox",
      label: "Is Recurring?",
      name: "recurringExpense.isRecurring",
    },
    {
      type: "select",
      label: "Frequency",
      name: "recurringExpense.frequency",
      options: ["monthly", "weekly", "yearly"],
      disabled: !values.recurringExpense?.isRecurring,
    },
    {
      type: "date",
      label: "Next Due Date",
      name: "recurringExpense.nextDueDate",
      disabled: !values.recurringExpense?.isRecurring,
    },
  ];

  return (
    <>
      {/* Staff Selection Section */}
      <StaffSelect
        name="staffId"
        label="Select Teaching Staff"
        setFieldValue={setFieldValue}
        value={values.staffId}
        staffType="teaching"
      />

      <TransactionDetails setFieldValue={setFieldValue} values={values} />
      {/* Recurring Expense Section */}
      <FormSection
        title="Recurring Expense"
        fields={recurringFields}
        setFieldValue={setFieldValue}
        values={values}
      />
    </>
  );
};

export default TeachingStaffForm;
