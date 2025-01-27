import React, { useEffect } from "react";
import { Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import { useFormikContext } from "formik";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";

export const SelectDynamicInput = ({ label, name, options, onChange, forWhom, disabled }) => {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  // Animation for the label and field
  const fieldVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="relative w-full mb-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
    >
      <motion.label
        htmlFor={name}
        className="text-sm text-gray-500 block mb-1"
        variants={fieldVariants}
        transition={{ delay: 0.1 }}
      >
        {label}
      </motion.label>
      <Field
        as="select"
        id={name}
        name={name}
        className="bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300"
        onChange={onChange}
        disabled={disabled}
      >
        <option value="" >Select</option>
        {options?.map((option, index) => (
          <motion.option
            key={index}
            value={option?._id}
            variants={fieldVariants}
            transition={{ delay: 0.2 }}
          >
            {forWhom == 'class' ? option?.className : forWhom == 'section' ? option?.sectionName : forWhom == 'student' ? option?.firstName + ' ' + option?.lastName : ''}
          </motion.option>
        ))}
      </Field>
      <motion.div
        className="text-sm text-red-500 mt-1"
        variants={fieldVariants}
        transition={{ delay: 0.3 }}
      >
        <ErrorMessage name={name} component="div" />
      </motion.div>
    </motion.div>
  );
};
export const OnePaymentDetail = ({ category }) => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    // Parse values
    const totalAmount = parseFloat(values[`totalAmount_${category}`]) || 0;
    const paidAmount = parseFloat(values[`paidAmount_${category}`]) || 0;
    const discount = parseFloat(values[`discount_${category}`]) || 0;
    const penalty = parseFloat(values[`penalty_${category}`]) || 0;
    const discountType = values[`discountType_${category}`]; // 'percentage' or 'amount'
  
    // Calculate finalAmount based on discountType
    let finalAmount = totalAmount;
  
    if (discountType === 'percentage') {
      finalAmount -= (totalAmount * discount) / 100; // Apply percentage discount
    } else if (discountType === 'amount') {
      finalAmount -= discount; // Apply fixed amount discount
    }
  
    finalAmount += penalty; // Add penalty if any
  
    // Calculate advanceAmount
    const advanceAmount = paidAmount > finalAmount ? paidAmount - finalAmount : 0;
  
    // Calculate remainingAmount
    const remainingAmount =
      finalAmount > paidAmount ? finalAmount - paidAmount : 0;
  
    // Set calculated values
    setFieldValue(`advanceAmount_${category}`, advanceAmount.toFixed(2));
    setFieldValue(`remainingAmount_${category}`, remainingAmount.toFixed(2));
    setFieldValue(`finalAmount_${category}`, finalAmount.toFixed(2));
  }, [
    values[`totalAmount_${category}`],
    values[`paidAmount_${category}`],
    values[`discount_${category}`],
    values[`penalty_${category}`],
    values[`discountType_${category}`], // Add discountType to dependencies
    setFieldValue,
    category,
  ]);
  

  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-6">
        <TextInput
          label="Total Amount"
          name={`totalAmount_${category}`}
          placeholder="Enter total amount"
          type="Number"
          required
        />
        <TextInput
          label={`Paid Amount (${category})`}
          name={`paidAmount_${category}`}
          placeholder="Enter paid amount"
          type="Number"
          required={true}
        />
        <TextInput
          label={`Advance Amount (${category})`}
          name={`advanceAmount_${category}`}
          placeholder={0}
          disabled={true}
        />
        <TextInput
          label={`Remaining Amount (${category})`}
          name={`remainingAmount_${category}`}
          placeholder={0}
          disabled={true}
        />
        <TextInput
          label="Final amount (After tax/discount/penalty)"
          name={`finalAmount_${category}`}
          placeholder={0}
          disabled={true}
        />
      </div>
    </div>
  );
};



