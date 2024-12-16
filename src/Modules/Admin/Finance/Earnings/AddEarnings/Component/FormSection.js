import React from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import FileInput from "./FileInput";

const FormSection = ({ title, fields, setFieldValue }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="grid grid-cols-3 gap-6">
        {fields.map((field, index) => {
          const { type, name, label, placeholder, options, ...rest } = field;

          if (
            type === "text" ||
            type === "number" ||
            type === "date" ||
            type === "datetime-local" ||
            type === "time"
          ) {
            return (
              <TextInput
                key={index}
                name={name}
                label={label}
                placeholder={placeholder}
                type={type}
                {...rest}
              />
            );
          }

          if (type === "select") {
            return (
              <SelectInput
                key={index}
                name={name}
                label={label}
                options={options}
                {...rest}
              />
            );
          }

          if (type === "file") {
            return (
              <FileInput
                key={index}
                name={name}
                label={label}
                onChange={(e) => setFieldValue(name, e.target.files[0])}
                {...rest}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default FormSection;
