import React, { useEffect, useState } from 'react';
import FormInput from '../subClass/component/FormInput';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseUrl } from '../../../../config/Common';
import toast from 'react-hot-toast';
import FormSelect from '../subClass/component/FormSelect';

const EditFee = ({ onUpdate, editFormData }) => {
  const role = useSelector((store) => store.Auth.role);
  const token = localStorage.getItem(`${role}:token`);
  useEffect(()=>{
    let dateformat = editFormData.dueDate?.slice(0,10)
    setFormData({
      feeId: editFormData.feeId,
      feeType: editFormData.feeType,
      dueDate: dateformat,
      amount: editFormData.amount,
      status:editFormData.status,
    });
    console.log(editFormData);
    
  },[editFormData])

  const [formData, setFormData] = useState({
    feeId: editFormData.feeId,
    feeType: editFormData.feeType,
    dueDate: editFormData.dueDate,
    amount: editFormData.amount,
    status:editFormData.status,
  });


  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseUrl}/admin/student/update_fees/${editFormData.feeId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authentication: `${token}`,
        },
      });
      toast.success('Fee record updated');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update fee record');
    }
  };
  const statusData = [
    {label:'Paid',value:'paid'},
    {label:'Unpaid',value:'unpaid'},
  ]
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FormInput id="feeType" label="Fees Type" type='text' value={formData.feeType} onChange={handleChange} required />
      <FormInput id="dueDate" label="Due Date" type="date" value={formData.dueDate} onChange={handleChange} required />
      <FormInput id="amount" label="Amount" type="text" value={formData.amount} onChange={handleChange} required />
      <FormSelect id="status" label="Status" options={statusData} value={formData.status} onChange={handleChange} required />
      <button type="submit" className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600">
        Edit Fees
      </button>
    </form>
  );
};

export default EditFee;
