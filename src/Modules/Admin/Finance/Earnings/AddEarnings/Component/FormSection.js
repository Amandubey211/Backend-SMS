// src/Components/Admin/Finance/Earnings/Component/FormSection.jsx

import React from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import FileInput from "./FileInput";
import { FieldArray } from "formik";
import { IoMdAdd, IoMdRemove } from "react-icons/io";

const FormSection = ({ title, fields, setFieldValue, values }) => {
  return (
    <div className="mb-6 px-3">
      {title && (
        <h2 className="text-md font-bold text-gray-800 mb-4">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fields?.map((field, index) => {
          const {
            type,
            name,
            label,
            placeholder,
            options,
            fields: subFields,
            emptyItem,
            ...rest
          } = field;

          // All fields are required
          const isRequired = true;

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
                  required={isRequired}
                  value={getNestedValue(values, name)}
                  onChange={(e) => {
                    const value =
                      type === "number"
                        ? e.target.value === ""
                          ? ""
                          : Number(e.target.value)
                        : e.target.value;
                    setFieldValue(name, value);
                  }}
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
                  required={isRequired}
                  value={getNestedValue(values, name)}
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
                  required={isRequired}
                  value={getNestedValue(values, name)}
                  onChange={
                    (e) => setFieldValue(name, e.target.value || null) // Set to URL string
                  }
                  {...rest}
                />
              );
            case "array":
              return (
                <div key={index} className="col-span-1 md:col-span-3">
                  <label className="text-sm text-gray-500 block mb-1">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <FieldArray
                    name={name}
                    render={(arrayHelpers) => (
                      <div>
                        {values[name] && values[name].length > 0 ? (
                          values[name]?.map((item, idx) => (
                            <div
                              key={idx}
                              className="border p-3 mb-2 rounded-md"
                            >
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="text-md font-medium">
                                  {label} #{idx + 1}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => arrayHelpers.remove(idx)}
                                  className="text-red-500 hover:text-red-700"
                                  aria-label={`Remove ${label} #${idx + 1}`}
                                >
                                  <IoMdRemove size={20} />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {subFields?.map((subField, subIdx) => (
                                  <div key={subIdx} className="w-full">
                                    {subField.type === "select" ? (
                                      <SelectInput
                                        name={`${name}.${idx}.${subField.name}`}
                                        label={subField.label}
                                        options={subField.options || []}
                                        required={isRequired}
                                        value={getNestedValue(
                                          values,
                                          `${name}.${idx}.${subField.name}`
                                        )}
                                        onChange={(value) =>
                                          setFieldValue(
                                            `${name}.${idx}.${subField.name}`,
                                            value
                                          )
                                        }
                                      />
                                    ) : (
                                      <TextInput
                                        name={`${name}.${idx}.${subField.name}`}
                                        label={subField.label}
                                        placeholder={subField.placeholder}
                                        type={subField.type}
                                        required={isRequired}
                                        value={getNestedValue(
                                          values,
                                          `${name}.${idx}.${subField.name}`
                                        )}
                                        onChange={(e) => {
                                          const value =
                                            subField.type === "number"
                                              ? e.target.value === ""
                                                ? ""
                                                : Number(e.target.value)
                                              : e.target.value;
                                          setFieldValue(
                                            `${name}.${idx}.${subField.name}`,
                                            value
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 mb-4">
                            No {label.toLowerCase()} added.
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => arrayHelpers.push(emptyItem)}
                          className="flex items-center text-purple-600 hover:text-purple-800"
                        >
                          <IoMdAdd size={20} className="mr-2" />
                          Add {label}
                        </button>
                      </div>
                    )}
                  />
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

// Helper function to get nested values from Formik's values
const getNestedValue = (values, path) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], values);
};

export default FormSection;
