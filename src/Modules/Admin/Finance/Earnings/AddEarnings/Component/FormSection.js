// src/Components/Admin/Finance/Earnings/Component/FormSection.jsx

import React from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import FileInput from "./FileInput";
import { FieldArray } from "formik";
import { IoMdAdd, IoMdRemove } from "react-icons/io";

// Helper function to get nested values from Formik's values
const getNestedValue = (values, path) => {
  return path
    .split(".")
    .reduce(
      (acc, part) => (acc && acc[part] !== undefined ? acc[part] : ""),
      values
    );
};

// Helper functions to handle date formatting
const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateFromInput = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString();
};

// Main FormSection Component
const FormSection = ({ title, fields, setFieldValue, values }) => {
  // Reusable function to render individual fields
  const renderField = (field, index) => {
    const { type, name, label, placeholder, options, ...rest } = field;
    const value = getNestedValue(values, name);

    // Handle change based on field type
    const handleChange = (e) => {
      let newValue = e.target.value;
      if (type === "number") {
        newValue = newValue === "" ? "" : Number(newValue);
      } else if (type === "date") {
        newValue = formatDateForInput(newValue);
      }
      setFieldValue(name, newValue);
    };

    // Switch case for different field types
    switch (type) {
      case "text":
      case "number":
      case "time":
        return (
          <TextInput
            key={index}
            name={name}
            label={label}
            placeholder={placeholder}
            type={type}
            required={true}
            value={value}
            onChange={handleChange}
            {...rest}
          />
        );
      case "date":
        return (
          <TextInput
            key={index}
            name={name}
            label={label}
            placeholder={placeholder}
            type="date"
            required={true}
            value={formatDateForInput(value)}
            onChange={handleChange}
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
            required={true}
            value={value}
            onChange={(val) => setFieldValue(name, val)}
            {...rest}
          />
        );
      case "file":
        return (
          <FileInput
            key={index}
            name={name}
            label={label}
            required={true}
            value={value}
            onChange={(e) => setFieldValue(name, e.target.value)}
            {...rest}
          />
        );
      case "array":
        return (
          <ArrayField
            key={index}
            label={label}
            name={name}
            fields={field.fields}
            emptyItem={field.emptyItem}
            setFieldValue={setFieldValue}
            values={values}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-6 px-3">
      {title && (
        <h2 className="text-md font-bold text-gray-800 mb-4">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fields.map((field, index) => renderField(field, index))}
      </div>
    </div>
  );
};

// Component to handle array fields (e.g., Documents)
const ArrayField = ({
  label,
  name,
  fields,
  emptyItem,
  setFieldValue,
  values,
}) => {
  return (
    <div className="col-span-1 md:col-span-3">
      <label className="text-sm text-gray-500 block mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <div>
            {values[name] && values[name].length > 0 ? (
              values[name].map((item, idx) => (
                <div key={idx} className="border p-3 mb-2 rounded-md">
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
                    {fields.map((subField, subIdx) => {
                      const subName = `${name}.${idx}.${subField.name}`;
                      const subValue = getNestedValue(values, subName);

                      // Handle date fields within array if any
                      const handleSubChange = (e) => {
                        let newValue = e.target.value;
                        if (subField.type === "number") {
                          newValue = newValue === "" ? "" : Number(newValue);
                        } else if (subField.type === "date") {
                          newValue = formatDateForInput(newValue);
                        }
                        setFieldValue(subName, newValue);
                      };

                      switch (subField.type) {
                        case "text":
                        case "number":
                        case "time":
                          return (
                            <TextInput
                              key={subIdx}
                              name={subName}
                              label={subField.label}
                              placeholder={subField.placeholder}
                              type={subField.type}
                              required={true}
                              value={subValue}
                              onChange={handleSubChange}
                              {...subField}
                            />
                          );
                        case "date":
                          return (
                            <TextInput
                              key={subIdx}
                              name={subName}
                              label={subField.label}
                              placeholder={subField.placeholder}
                              type="date"
                              required={true}
                              value={formatDateForInput(subValue)}
                              onChange={handleSubChange}
                              {...subField}
                            />
                          );
                        case "select":
                          return (
                            <SelectInput
                              key={subIdx}
                              name={subName}
                              label={subField.label}
                              options={subField.options || []}
                              required={true}
                              value={subValue}
                              onChange={(val) => setFieldValue(subName, val)}
                              {...subField}
                            />
                          );
                        case "file":
                          return (
                            <FileInput
                              key={subIdx}
                              name={subName}
                              label={subField.label}
                              required={true}
                              value={subValue}
                              onChange={(e) =>
                                setFieldValue(subName, e.target.value)
                              }
                              {...subField}
                            />
                          );
                        default:
                          return null;
                      }
                    })}
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
              className="flex items-center text-purple-600 hover:text-purple-800 mt-2"
            >
              <IoMdAdd size={20} className="mr-2" />
              Add {label}
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default FormSection;
