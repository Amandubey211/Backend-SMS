import React, { useEffect, useState } from 'react';
import FormInput from '../subClass/component/FormInput';
import { useDispatch, useSelector } from 'react-redux';
import FormSelect from '../subClass/component/FormSelect';
import { fetchFees, updateStudentFee } from '../../../../Store/Slices/Admin/Accounting/StudentFees/studentFees.action';
import { setEditFormData } from '../../../../Store/Slices/Admin/Accounting/StudentFees/studentFeesSlice';

const EditFee = () => {
  const dispatch = useDispatch();
  const { editFormData } = useSelector((store) => store?.admin?.student_fees)

  const [formData, setFormData] = useState({
    feeId: editFormData.feeId,
    feeType: editFormData.feeType,
    dueDate: editFormData.dueDate,
    amount: editFormData.amount,
    status: editFormData.status,
  });

  useEffect(() => {
    if (editFormData && editFormData.feeId) {
      setFormData({
        feeId: editFormData.feeId || '',
        feeType: editFormData.feeType || '',
        dueDate: editFormData.dueDate?.slice(0, 10) || '',
        amount: editFormData.amount || '',
        status: editFormData.status || 'unpaid', // Provide default status
      });
    }
  }, [editFormData]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("fomData- feeeId", formData);
    dispatch(updateStudentFee({ feeId: formData.feeId, submissionData: formData }))
      .then(() => {
        dispatch(fetchFees())
      })
  };
  const statusData = [
    { label: 'Paid', value: 'paid' },
    { label: 'Unpaid', value: 'unpaid' },
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
