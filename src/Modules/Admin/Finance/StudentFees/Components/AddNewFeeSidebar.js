import React, { useState } from 'react';

const AddNewFeeSidebar = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    type: 'single',
    class: '',
    section: '',
    studentId: '',
    studentMailId: '',
    feeType: 'Monthly Fee',
    dueDate: '',
    amount: '',
    penaltyDate: '',
    sendNotification: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({
      ...prev,
      sendNotification: !prev.sendNotification,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
    // Add your submit logic here
  };

  if (!isOpen) return null;

  return (
    <div className="fixed -top-6 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-96 p-6 overflow-y-auto shadow-xl">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 absolute top-4 right-4"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New Fees</h2>

        {/* Fee Type Radio Buttons */}
        <div className="flex space-x-4 mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="single"
              checked={formData.type === 'single'}
              onChange={() => setFormData({ ...formData, type: 'single' })}
              className="appearance-none rounded-full h-4 w-4 border-2 border-green-600 checked:bg-green-600"
            />
            <span>Single Fees</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="mass"
              checked={formData.type === 'mass'}
              onChange={() => setFormData({ ...formData, type: 'mass' })}
              className="appearance-none rounded-full h-4 w-4 border-2 border-green-600 checked:bg-green-600"
            />
            <span>Mass Fees</span>
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Class and Section */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-600 mb-2">Class</label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select</option>
                <option value="Ten">Ten</option>
                <option value="Nine">Nine</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-gray-600 mb-2">Section</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
          </div>

          {/* Student ID and Mail */}
          <div>
            <label className="block text-gray-600 mb-2">Student ID/Name</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Student Mail ID</label>
            <input
              type="text"
              name="studentMailId"
              value={formData.studentMailId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Fee Type */}
          <div>
            <label className="block text-gray-600 mb-2">Fees Type</label>
            <select
              name="feeType"
              value={formData.feeType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="Monthly Fee">Monthly Fee</option>
              <option value="Annual Fee">Annual Fee</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-gray-600 mb-2">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-gray-600 mb-2">Amount</label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Penalty Date */}
          <div>
            <label className="block text-gray-600 mb-2">Automatic Penalty Date</label>
            <input
              type="date"
              name="penaltyDate"
              value={formData.penaltyDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          {/* Notification Toggle */}
          <div
            className="flex justify-between items-center p-4 rounded-lg"
            style={{ background: "linear-gradient(90deg, #FFECF1 0%, #EFDFFF 100%)" }}
          >
            <label className="block text-gray-600">Send Notification to Student</label>
            <div
              onClick={handleToggle}
              className={`relative w-12 h-6 rounded-full cursor-pointer ${formData.sendNotification
                  ? "bg-gradient-to-r from-[#C83B62] to-[#46138A]"
                  : "bg-gray-300"
                }`}
            >
              <div
                className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transform transition-transform ${formData.sendNotification ? "translate-x-6" : ""
                  }`}
              />
            </div>
          </div>



          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-md mt-4"
          >
            Add New Fees
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewFeeSidebar;
