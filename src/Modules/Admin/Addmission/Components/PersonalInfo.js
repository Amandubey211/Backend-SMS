import React from "react";

const PersonalInfo = ({ studentInfo, handleInputChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700">First Name</label>
        <input
          type="text"
          name="firstName"
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={studentInfo.firstName}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label className="block text-gray-700">Last Name</label>
        <input
          type="text"
          name="lastName"
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={studentInfo.lastName}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label className="block text-gray-700">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={studentInfo.dateOfBirth}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label className="block text-gray-700">Gender</label>
        <select
          name="gender"
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={studentInfo.gender}
          onChange={handleInputChange}
        >
          <option value="">Choose Options</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700">Nationality</label>
        <select
          name="nationality"
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={studentInfo.nationality}
          onChange={handleInputChange}
        >
          <option value="">Choose Options</option>
          <option>Islam</option>
          <option>Christianity</option>
          <option>Hinduism</option>
          <option>Buddhism</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Blood Group</label>
          <select
            name="bloodGroup"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.bloodGroup}
            onChange={handleInputChange}
          >
            <option value="">Choose Options</option>
            <option>O+</option>
            <option>O-</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            placeholder="00"
            name="age"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.age}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
