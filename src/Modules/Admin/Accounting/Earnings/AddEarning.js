import React,{useState} from 'react'
import FormInput from '../subClass/component/FormInput'

const AddEarning = () => {
    const [formData, setFormData] = useState({
        payerName: '',
        paymentDate: '',
        amount: '',
        description:''
      });
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting  New Earning:', formData);
      };
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
    <FormInput id="payerName" label="Student ID" type="text" value={formData.payerName} onChange={handleChange} required />
    <FormInput id="amount" label="Amount" type="text" value={formData.amount} onChange={handleChange} required />

    <FormInput id="paymentDate" label="Payment Date" type="date" value={formData.paymentDate} onChange={handleChange} required />
    <FormInput id="description" label="Description" type="text" value={formData.description} onChange={handleChange} required />
    <button type="submit" className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium  bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600">
      Add New Earning
    </button>
  </form>  )
}

export default AddEarning