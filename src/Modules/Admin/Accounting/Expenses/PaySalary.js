import React,{useState} from 'react';

const PaySalary = ({ teacher }) => {
    const [salaryAmount, setSalaryAmount] = useState(teacher ? teacher.salaryAmount : 0);

    if (!teacher) {  // Check if teacher is null
        return <div>Loading...</div>;  // Handle the null case appropriately
    } 

    const handlePayment = () => {
        console.log('Processing payment for', teacher.name, 'Amount:', salaryAmount);
        // Implement the payment processing logic here
    };
  return (

    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold">Pay Salary</h2>
      </div>
      <div className="flex flex-col items-center mb-4">
        <img
          src={teacher.imageUrl}
          alt={teacher.name}
          className="w-24 h-24 rounded-full"
        />
        <h3 className="mt-2 text-lg font-semibold">{teacher.name}</h3>
        <p>{teacher.subject}</p>
        <p>{teacher.contact}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Salary Amount
        </label>
        <input
                    type="number"  // Change type to number for better user experience
                    value={salaryAmount}
                    onChange={e => setSalaryAmount(e.target.value)}  // Update state on change
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                />
      </div>
      <button
       onClick={handlePayment}
        // onClick={() => console.log('Processing payment for', teacher.name)}
        className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaySalary;
