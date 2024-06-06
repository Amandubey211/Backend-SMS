import React, { useState } from 'react';
import FormInput from '../subClass/component/FormInput';
import FormSelect from '../subClass/component/FormSelect';

const MassFee = () => {
  const [formData, setFormData] = useState({
    class: '',
    section: 'All',
    feesType: '',
    invoiceSessionStart: '',
    invoiceSessionEnd: '',
    amount: '',
    automaticInvoiceCreateDate: '01'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const classOptions = [{ value: "Ten", label: "Ten" }, { value: "Nine", label: "Nine" }];
  const sectionOptions = [{ value: "A", label: "A" }, { value: "B", label: "B" }];
  const feesTypeOptions = [
    { value: "Test Exam", label: "Test Exam" },
    { value: "Final Exam", label: "Final Exam" },
    { value: "Monthly Fee", label: "Monthly Fee" }
  ];
  const invoiceDateOptions = [
    { value: "01", label: "1st of the month" },
    { value: "15", label: "15th of the month" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting Mass Fee:', formData);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className='flex justify-between px-4'>
        <FormSelect id="class" label="Class" options={classOptions} value={formData.class} onChange={handleChange} required />
        <FormSelect id="section" label="Section" options={sectionOptions} value={formData.section} onChange={handleChange} required />
      </div>
      <FormSelect id="feesType" label="Fees Type" options={feesTypeOptions} value={formData.feesType} onChange={handleChange} required />
      <div className="grid grid-cols-2 gap-4">
        <FormInput id="invoiceSessionStart" label="Invoice Session Start" type="date" value={formData.invoiceSessionStart} onChange={handleChange} required />
        <FormInput id="invoiceSessionEnd" label="Invoice Session End" type="date" value={formData.invoiceSessionEnd} onChange={handleChange} required />
      </div>
      <FormInput id="amount" label="Amount" type="text" value={formData.amount} onChange={handleChange} required />
      <FormSelect id="automaticInvoiceCreateDate" label="Automatic Invoice Create Date" options={invoiceDateOptions} value={formData.automaticInvoiceCreateDate} onChange={handleChange} required />
      <button type="submit" className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium  bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600">
        Add New Fees 
      </button>
    </form>
  );
};

export default MassFee;







