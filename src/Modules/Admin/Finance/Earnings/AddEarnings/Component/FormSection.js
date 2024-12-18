// FormSection.jsx
import React from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import FileInput from "./FileInput";

const FormSection = ({ title, fields, setFieldValue, values }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fields.map((field, index) => {
          const { type, name, label, placeholder, options, ...rest } = field;

          switch (type) {
            case "text":
            case "number":
            case "date":
            case "datetime-local":
            case "time":
              return (
                <TextInput
                  key={index}
                  name={name}
                  label={label}
                  placeholder={placeholder}
                  type={type}
                  value={values?.[name]}
                  onChange={(e) => setFieldValue(name, e.target.value)}
                  {...rest}
                />
              );
            case "select":
              return (
                <SelectInput
                  key={index}
                  name={name}
                  label={label}
                  options={options || []}
                  value={values?.[name]}
                  onChange={(value) => setFieldValue(name, value)}
                  {...rest}
                />
              );
            case "file":
              return (
                <FileInput
                  key={index}
                  name={name}
                  label={label}
                  onChange={(e) =>
                    setFieldValue(name, e.target.files[0] || null)
                  }
                  {...rest}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default FormSection;
