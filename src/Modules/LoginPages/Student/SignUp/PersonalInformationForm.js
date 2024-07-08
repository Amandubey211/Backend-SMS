import React, { useEffect, useState } from "react";
import useGetAllSchools from "../../../../Hooks/AuthHooks/Staff/Admin/useGetAllSchool";
import { message } from "antd";

const PersonalInformationForm = ({ studentDetails, handleChange, imagePreview, setImagePreview, handleImageChange }) => {
  const { fetchSchools, schoolList } = useGetAllSchools();

  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <>
      <div className="flex items-center space-x-6">
        <div className="w-1/2">
          <label className="block text-lg font-semibold mb-2 mt-2 text-gray-700">School</label>
          <select
            name="schoolId"
            className="block w-full rounded-lg border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-700 p-3"
            value={studentDetails.schoolId}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choose School
            </option>
            {schoolList.map((school, index) => (
              <option key={index} value={school._id} className="py-2">
                {school.nameOfSchool}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/2 flex justify-center">
          <div className="relative group">
            <input
              type="file"
              name="profile"
              
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              required
            />
            <div className="h-32 w-32 rounded-full border border-gray-300 shadow-sm overflow-hidden cursor-pointer bg-gray-100 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Selected Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-gray-500">Upload Image</span>
              )}
            </div>
          </div>
        </div>
      </div>

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
      <div className="mb-4">
        <input
          type="email"
          name="email"
          value={studentDetails.email}
          onChange={handleChange}
          placeholder="Email*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
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
          type="number"
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
      <h3 className="text-lg font-semibold mb-2">Guardian Information</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="motherName"
          value={studentDetails.motherName}
          onChange={handleChange}
          placeholder="Mother's Name*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <input
          type="text"
          name="fatherName"
          value={studentDetails.fatherName}
          onChange={handleChange}
          placeholder="Father's Name*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="guardianName"
          value={studentDetails.guardianName}
          onChange={handleChange}
          placeholder="Guardian's Name*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <input
          type="text"
          name="guardianRelationToStudent"
          value={studentDetails.guardianRelationToStudent}
          onChange={handleChange}
          placeholder="Relation to Student*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="number"
          name="guardianContactNumber"
          value={studentDetails.guardianContactNumber}
          onChange={handleChange}
          placeholder="Guardian's Contact Number*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="email"
          name="guardianEmail"
          value={studentDetails.guardianEmail}
          onChange={handleChange}
          placeholder="Guardian's Email*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold">
          Select Enrollment Status <span className="font-extralight">(Required)</span>
        </label>
        <select
          name="enrollmentStatus"
          value={studentDetails.enrollmentStatus}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold">
          Transport Requirement* <span className="font-extralight">(Required)</span>
        </label>
        <div className="mt-1 flex items-center">
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="transportRequirement"
              value="true"
              checked={studentDetails.transportRequirement === "true"}
              onChange={(e) => handleChange({ target: { name: e.target.name, value: e.target.value } })}
              className="h-4 w-4 border-gray-300 focus:ring-green-500"
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="transportRequirement"
              value="false"
              checked={studentDetails.transportRequirement === "false"}
              onChange={(e) => handleChange({ target: { name: e.target.name, value: e.target.value } })}
              className="h-4 w-4 border-gray-300 focus:ring-red-500"
            />
            <span className="ml-2">No</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default PersonalInformationForm;
