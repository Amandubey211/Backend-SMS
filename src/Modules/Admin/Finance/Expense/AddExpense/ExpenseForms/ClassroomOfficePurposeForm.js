import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import ItemsSection from "../Components/ItemsSection";
import TransactionDetails from "../Components/TransactionDetails";

const ClassroomOfficePurposeForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const expenseDetailsFields = [
    {
      type: "text",
      label: "Name",
      name: "name",
      placeholder: "Enter name",
    },
    {
      type: "text",
      label: "Vendor",
      name: "vendor",
      placeholder: "Enter vendor name",
    },
    {
      type: "date",
      label: "Purchased Date",
      name: "purchasedDate",
    },
  ];

  return (
    <>
      <FormSection
        fields={expenseDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />
      <ItemsSection type="classroom" />
      <TransactionDetails setFieldValue={setFieldValue} values={values} />
    </>
  );
};

export default ClassroomOfficePurposeForm;
