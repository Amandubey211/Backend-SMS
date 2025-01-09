import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../../../Earnings/AddEarnings/Component/FormSection";
import TransactionDetails from "../Components/TransactionDetails";

const BuildingMaintenanceForm = () => {
  const { setFieldValue, values } = useFormikContext();

  const expenseDetailsFields = [
    {
      type: "select",
      label: "Maintenance Type",
      name: "maintenanceCategory",
      options: [
        "building",
        "furniture",
        "itEquipment",
        "stationery",
        "transport",
        "other",
      ],
    },

    {
      type: "text",
      label: "Name",
      name: "name",
      placeholder: "Enter service provider name",
    },
    {
      type: "text",
      label: "vendor",
      name: "vendor",
      placeholder: "Enter vendor name",
    },
  ];

  return (
    <>
      <FormSection
        title="Maintenance Details"
        fields={expenseDetailsFields}
        setFieldValue={setFieldValue}
        values={values}
      />
      <TransactionDetails setFieldValue={setFieldValue} values={values} />
    </>
  );
};

export default BuildingMaintenanceForm;
