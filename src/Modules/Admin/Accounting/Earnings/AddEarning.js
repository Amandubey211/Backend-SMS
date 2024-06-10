import React,{useState} from 'react'
import FormInput from '../subClass/component/FormInput'
import FormSelect from '../subClass/component/FormSelect';

const AddEarning = () => {
    const [formData, setFormData] = useState({
        paymentDate: '',
        amount: '',
        description:'',
        paymentStatus:''
      });
      const [paymentStatus, setPaymentStatus] = useState('single');

      
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting  New Earning:', formData);
      };
      const handleChange = (e,status) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
      
      const handlePaymentStatusChange = (status) => {
        setFormData((prev) => ({ ...prev, paymentStatus: status }));
      };
  return (
    <form className="space-y-4 mt-2 " onSubmit={handleSubmit}>
    <FormInput id="amount" label="Amount" type="text" value={formData.amount} onChange={handleChange} required />
    <div className="flex items-center">
        {['Paid Expenses', 'Due Expenses'].map((status) => (
          <label key={status} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="paymentStatus"
              value={status}
              checked={formData.paymentStatus === status}
              onChange={() => handlePaymentStatusChange(status)}
              className="hidden"
            />
            <div
              className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${
                formData.paymentStatus === status ? 'border-green-500 bg-green-500' : 'border-gray-300'
              }`}
            >
              {formData.paymentStatus === status && (
                <div className="h-3 w-3 bg-white rounded-full"></div>
              )}
            </div>
            <span
              className={`transition-colors duration-200 ${
                formData.paymentStatus === status ? 'text-red-700' : 'text-gray-700'
              }`}
            >
              {status}
            </span>
          </label>
        ))}
      </div>
    <FormInput id="paymentDate" label="Expense Date" type="date" value={formData.paymentDate} onChange={handleChange} required />
    <FormInput id="description" label="Expense Reason" type="text" value={formData.description} onChange={handleChange} required />
    <button type="submit" className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium  bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600">
      Add New Earning
    </button>
  </form>  )
}

export default AddEarning