import React from 'react';

const FormField = ({ id, name, label, value, onChange, options }) => {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded px-3 py-2"
      >
        <option value="">All</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormField;
