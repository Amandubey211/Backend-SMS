import React from "react";

const HelperForm = ({
  helperData,
  handleChange,
  handleSubmit,
  resetForm,
  isEditing
}) => {
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-purple-50 p-3 rounded-md mb-4">
        <h3 className="text-md font-medium text-purple-800 mb-3">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={helperData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={helperData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="trans">Trans</option>
            </select>
          </div>

          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number *
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={helperData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
              Blood Group
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={helperData.bloodGroup}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="" disabled>Select blood group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={helperData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Submit/Cancel */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"

          onClick={resetForm}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {isEditing ? "Update Helper" : "Add Helper"}
        </button>
      </div>
    </form>
  );
};

export default HelperForm;
