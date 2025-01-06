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
  disabled,
  autoComplete = 'off',
  onBlur,
  onChange,
}) => {
  // Extract relevant state from Redux
  const { loading, error, invoiceFetchSuccess } = useSelector(
    (state) => state.admin.invoices
  );

  // Determine which icon to display
  let icon = null;
  if (loading) {
    icon = <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />;
  } else if (error) {
    icon = (
      <Tooltip title="Failed to fetch invoice data">
        <CloseCircleOutlined style={{ color: 'red' }} />
      </Tooltip>
    );
  } else if (invoiceFetchSuccess) {
    icon = (
      <Tooltip title="Invoice data fetched successfully">
        <CheckCircleOutlined style={{ color: 'green' }} />
      </Tooltip>
    );
  }

  return (
    <motion.div
      className="relative w-full mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={name} className="text-sm text-gray-500 block mb-1">
        {label}
      </label>
      <div className="relative">
        <Field
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled || false}
          className="bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-800 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-purple-300"
          autoComplete={autoComplete}
          onBlur={onBlur} // Pass onBlur to Field
          onChange={onChange} // Pass onChange to Field
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
