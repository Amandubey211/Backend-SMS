import React from 'react';

const FormField = ({ id, name, label, value, onChange, options }) => {
  return (
    <div className="form-field border  px-5 py-2 ">
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} value={value} onChange={onChange}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormField;
