import React, { useState } from 'react';
import axios from 'axios';
import FormInput from '../../subClass/component/FormInput';
import { baseUrl } from '../../../../../config/Common';
import { useDispatch, useSelector } from 'react-redux';
import { createExpense } from '../../../../../Store/Slices/Admin/Accounting/Expenses/expenses.action';

const AddExpense = ({ onCreate }) => {

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    reason: '',
    status: 'paid', // Default to paid
  });
  //const role = useSelector((store) => store.Auth.role);
  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log('Submitting New Expense:', formData);

    const payload = {
      amount: formData.amount,
      date: formData.date,
      reason: formData.reason,
      status: formData.status === 'Paid Expenses' ? 'paid' : 'unpaid',
    };

    //const response = await axios.post(`${baseUrl}/api/admin/expenses/`, payload, config);
    //console.log('Expense saved successfully:', response.data);

    dispatch(createExpense({ payload })).then(() => {
      setFormData({
        amount: '',
        date: '',
        reason: '',
        status: 'paid',
      });
      onCreate();
    })

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
              name="status"
              value="Paid Expenses"
              checked={formData.status === 'Paid Expenses'}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Paid Expenses</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="Due Expenses"
              checked={formData.status === 'Due Expenses'}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Due Expenses</span>
          </label>
        </div>
      </div>
      <FormInput id="date" name="date" label="Expense Date" type="date" value={formData.date} onChange={handleChange} required />
      <FormInput id="reason" name="reason" label="Expense Reason" type="text" value={formData.reason} onChange={handleChange} required />
      <button type="submit" className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600">
        Add New Expense
      </button>
    </form>
  );
};

export default AddExpense;
