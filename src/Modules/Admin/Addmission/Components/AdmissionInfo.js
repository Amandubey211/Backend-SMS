// src/components/AdmissionInfo.js

import React, { useEffect } from "react";

import useGetAllClasses from "../../../../Hooks/AuthHooks/Staff/Admin/useGetAllClasses";
import useGetAllSchools from "../../../../Hooks/AuthHooks/Staff/Admin/useGetAllSchool";


import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllClasses from "../../../../Hooks/AuthHooks/Staff/Admin/Class/useGetAllClasses";

const AdmissionInfo = ({ studentInfo, handleInputChange }) => {
  const { fetchClasses } = useGetAllClasses();
  const { fetchSchools } = useGetAllSchools();
  const { cid } = useParams();
  const { sid } = useParams();

  const classList = useSelector((store) => store.Class.classList);
  const schoolList = useSelector((store)=> store.School.schoolList);
  useEffect(() => {
    fetchClasses(cid);
    fetchSchools(sid);
  }, []);
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Admission to Class</h2>
      
      <div className="grid grid-cols-3 gap-4">
      <div>
          <label className="block text-gray-700">School</label>
          <select
            name="school"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.school}
            onChange={handleInputChange}
          >
            <option value="">Choose Options</option>
            {schoolList.map((school, index) => (
              <option key={index} value={school?.name} className="py-2">
                {school.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Class</label>
          <select
            name="class"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.class}
            onChange={handleInputChange}
          >
            <option value="">Choose Options</option>
            {classList?.map((classItem, index) => (
              <option key={index} value={classItem?.className} className="py-2">
                {classItem.className}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Section</label>
          <select
            name="section"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.section}
            onChange={handleInputChange}
          >
            <option value="">Choose Options</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Session</label>
          <input
            type="text"
            name="session"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.session}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-700">Admission Fee</label>
          <div className="flex items-center mt-1 p-2 rounded-md border border-gray-300 shadow-sm focus-within:border-indigo-300 focus-within:ring focus-within:ring-indigo-200 focus-within:ring-opacity-50">
            <input
              type="text"
              name="admissionFee"
              className="flex-grow focus:outline-none"
              value={studentInfo.admissionFee}
              onChange={handleInputChange}
            />
            <span className="ml-2">QR</span>
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Status</label>
          <select
            name="status"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.status}
            onChange={handleInputChange}
          >
            <option>Paid</option>
            <option>Unpaid</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdmissionInfo;
