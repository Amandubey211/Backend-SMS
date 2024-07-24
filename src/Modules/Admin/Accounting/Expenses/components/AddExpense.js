import React, { useState } from 'react';
import axios from 'axios';  // Importing Axios
import FormInput from '../../subClass/component/FormInput';
import { baseUrl } from '../../../../../config/Common';

const AddExpense = ({ fetchEarning }) => {
  const [formData, setFormData] = useState({
    amount: '',
    expenseDate: '',
    expenseReason: '',
    paymentStatus: 'Paid Expenses', // Default to Paid Expenses
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting New Expense:', formData);
    const token = localStorage.getItem('admin:token');

    if (!token) {
      console.error('Authentication token is not available.');
      return;
    }

    const payload = {
      amount: formData.amount,
      dateOfEarning: formData.expenseDate,
      expenseReason: formData.expenseReason,
      paymentStatus: formData.paymentStatus,
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authentication': `${token}`
      }
    };

    try {
      const response = await axios.post(`${baseUrl}/api/admin/expenses/`, payload, config);
      console.log('Expense saved successfully:', response.data);
      setFormData({
        amount: '',
        expenseDate: '',
        expenseReason: '',
        paymentStatus: 'Paid Expenses',
      });
      fetchEarning();
    } catch (error) {
      console.error('Error saving the expense:', error.response ? error.response.data.msg : error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
      <FormInput id="amount" name="amount" label="Amount" type="text" value={formData.amount} onChange={handleChange} required />
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentStatus"
              value="Paid Expenses"
              checked={formData.paymentStatus === 'Paid Expenses'}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Paid Expenses</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentStatus"
              value="Due Expenses"
              checked={formData.paymentStatus === 'Due Expenses'}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Due Expenses</span>
          </label>
        </div>
      </div>
      <FormInput id="expenseDate" name="expenseDate" label="Expense Date" type="date" value={formData.expenseDate} onChange={handleChange} required />
      <FormInput id="expenseReason" name="expenseReason" label="Expense Reason" type="text" value={formData.expenseReason} onChange={handleChange} required />
      <button type="submit" className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600">
        Add New Expense
      </button>
    </form>
  );
};

export default AddExpense;
