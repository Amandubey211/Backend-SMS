import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PersonalInformationForm = ({
  studentDetails,
  handleChange,
  showPassword,
  setShowPassword,
}) => {
  return (
    <>
      <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="firstName"
          value={studentDetails.firstName}
          onChange={handleChange}
          placeholder="First Name*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <input
          type="text"
          name="lastName"
          value={studentDetails.lastName}
          onChange={handleChange}
          placeholder="Last Name*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="email"
          name="email"
          value={studentDetails.email}
          onChange={handleChange}
          placeholder="Email*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={studentDetails.password}
            onChange={handleChange}
            placeholder="Password*"
            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="date"
          name="dateOfBirth"
          value={studentDetails.dateOfBirth}
          onChange={handleChange}
          placeholder="Date of Birth*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <input
          type="text"
          name="placeOfBirth"
          value={studentDetails.placeOfBirth}
          onChange={handleChange}
          placeholder="Place of Birth*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="number"
          name="age"
          value={studentDetails.age}
          onChange={handleChange}
          placeholder="Age*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <select
          name="gender"
          value={studentDetails.gender}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="" disabled>
            Select Gender*
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="trans">trans</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="mb-4">
        <input
          type="number"
          name="contactNumber"
          value={studentDetails.contactNumber}
          onChange={handleChange}
          placeholder="Contact Number*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          name="emergencyNumber"
          value={studentDetails.emergencyNumber}
          onChange={handleChange}
          placeholder="Emergency Contact Number*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">Identity Information</h3>
      <div className="mb-4">
        <input
          type="text"
          name="Q_Id"
          value={studentDetails.Q_Id}
          onChange={handleChange}
          placeholder="QID*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
    </>
  );
};

export default PersonalInformationForm;
