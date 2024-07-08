import React, { useState } from 'react';
import FormInput from '../subClass/component/FormInput';
import FormSelect from '../subClass/component/FormSelect';

const SingleFee = () => {
  const [formData, setFormData] = useState({
    class: '',
    section: '',
    studentId: '',
    feesType: '',
    dueDate: '',
    amount: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const classOptions = [{ value: "Ten", label: "Ten" }, { value: "Nine", label: "Nine" }];
  const sectionOptions = [{ value: "A", label: "A" }, { value: "B", label: "B" }];
  const feesTypeOptions = [{ value: "Test Exam", label: "Test Exam" }, { value: "Final Exam", label: "Final Exam" }];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting Single Fee:', formData);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FormSelect id="class" label="Class" options={classOptions} value={formData.class} onChange={handleChange} required />
      <FormSelect id="section" label="Section" options={sectionOptions} value={formData.section} onChange={handleChange} required />
      <FormInput id="studentId" label="Student ID" type="text" value={formData.studentId} onChange={handleChange} required />
      <FormSelect id="feesType" label="Fees Type" options={feesTypeOptions} value={formData.feesType} onChange={handleChange} required />
      <FormInput id="dueDate" label="Due Date" type="date" value={formData.dueDate} onChange={handleChange} required />
      <FormInput id="amount" label="Amount" type="text" value={formData.amount} onChange={handleChange} required />
      <button type="submit" className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium  bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600">
        Add New Fees
      </button>
    </form>
  );
};

export default SingleFee;

