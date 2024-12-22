// src/Components/Admin/Finance/Earnings/EarningsForm/DynamicForm.jsx

import React from "react";
import { useFormikContext } from "formik";
import FormSection from "../Component/FormSection";

const DynamicForm = ({ fields }) => {
  const { setFieldValue, values } = useFormikContext();

  return (
    <>
      <FormSection
        title=""
        fields={fields}
        setFieldValue={setFieldValue}
        values={values}
      />
    </>
  );
};

export default DynamicForm;
