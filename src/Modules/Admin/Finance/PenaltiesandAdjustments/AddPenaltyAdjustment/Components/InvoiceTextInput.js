// src/Modules/Admin/Finance/PenaltiesandAdjustments/AddPenaltyAdjustment/Components/InvoiceTextInput.js

import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';
import { Spin, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const InvoiceTextInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  disabled = false,
  readOnly = false, // Added readOnly prop
  autoComplete = 'off',
  onBlur,
  onChange,
  required = false, // Added required prop
  errorState = false, // New prop to indicate error state
  isEditMode = false, // New prop to indicate edit mode
}) => {
  // Extract relevant state from Redux
  const { loading, invoiceFetchSuccess } = useSelector(
    (state) => state.admin.invoices || {}
  );

  // Determine which icon to display
  let icon = null;
  if (loading) {
    icon = <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />;
  } else if (errorState && !isEditMode) {
    icon = (
      <Tooltip title="Invoice not found">
        <CloseCircleOutlined style={{ color: 'red' }} />
      </Tooltip>
    );
  } else if (invoiceFetchSuccess && !errorState && !isEditMode) {
    icon = (
      <Tooltip title="Invoice data fetched successfully">
        <CheckCircleOutlined style={{ color: 'green' }} />
      </Tooltip>
    );
  }

  // Combined onChange handler
  const handleChange = (e) => {
    if (onChange) {
      onChange(e); // Execute any additional onChange logic
    }
    // Formik's onChange is handled automatically by Field
  };

  return (
    <motion.div
      className="relative w-full mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={name} className="text-sm text-gray-500 block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Field
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled || readOnly}
          readOnly={readOnly}
          className={`bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-800 w-full pr-10 focus:outline-none ${
            required ? 'focus:ring-red-300' : 'focus:ring-purple-300'
          }`}
          autoComplete={autoComplete}
          onBlur={onBlur}
          onChange={handleChange}
        />
        {icon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-red-500 mt-1"
      />
    </motion.div>
  );
};

export default InvoiceTextInput;
