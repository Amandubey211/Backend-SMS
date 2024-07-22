import React, { useState } from 'react';
import FormInput from '../subClass/component/FormInput';
import axios from 'axios';  // Importing Axios

const AddEarning = ({ fetchEarning }) => {
  const [formData, setFormData] = useState({
    paymentDate: '',
    amount: '',
    description: '',
    paymentStatus: '',
    paymentFrom: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting New Earning:', formData);
    const token = localStorage.getItem('admin:token');

    if (!token) {
      console.error('Authentication token is not available.');
      return;
    }


    const payload = {
      from: formData.paymentFrom,
      amount: formData.amount,
      dateOfEarning: formData.paymentDate,
      description: formData.description,
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authentication': `${token}`
      }
    };

    try {

      const response = await axios.post('http://localhost:8080/admin/addEarning', payload, config);
      console.log('Earning saved successfully:', response.data);
      setFormData({
        paymentDate: '',
        amount: '',
        description: '',
        paymentStatus: '',
        paymentFrom: '',
      })
      fetchEarning()
    } catch (error) {
      console.error('Error saving the earning:', error.response ? error.response.data.msg : error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
      <FormInput id="paymentFrom" label="From" type="text" value={formData.paymentFrom} onChange={handleChange} required />
      <FormInput id="amount" label="Amount" type="text" value={formData.amount} onChange={handleChange} required />
      <FormInput id="paymentDate" label="Earning Date" type="date" value={formData.paymentDate} onChange={handleChange} required />
      <FormInput id="description" label="Description" type="text" value={formData.description} onChange={handleChange} required />
      <button type="submit" className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600">
        Add New Earning
      </button>
    </form>
  );
};

export default AddEarning;
