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
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-end">
      <div className="bg-white w-96 p-6 overflow-y-auto shadow-xl">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 absolute top-4 right-4"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New Fees</h2>

        {/* Fee Type Toggle */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md text-white ${
              formData.type === 'single' ? 'bg-purple-600' : 'bg-gray-300'
            }`}
            onClick={() => setFormData({ ...formData, type: 'single' })}
          >
            Single Fees
          </button>
          <button
            className={`px-4 py-2 rounded-md text-white ${
              formData.type === 'mass' ? 'bg-purple-600' : 'bg-gray-300'
            }`}
            onClick={() => setFormData({ ...formData, type: 'mass' })}
          >
            Mass Fees
          </button>
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
          <div className="flex items-center">
            <label className="block text-gray-600 mr-2">
              Send Notification to Student
            </label>
            <div
              onClick={handleToggle}
              className={`w-12 h-6 rounded-full p-1 cursor-pointer ${
                formData.sendNotification
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600'
                  : 'bg-gray-300'
              }`}
            >
              <div
                className={`h-4 w-4 bg-white rounded-full transform ${
                  formData.sendNotification ? 'translate-x-6' : ''
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
