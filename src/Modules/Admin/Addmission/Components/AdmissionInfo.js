import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SelectInput from "../../../LoginPages/Student/SignUp/SelectInput";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";

const AdmissionInfo = ({ studentInfo, handleInputChange }) => {
  const classList = useSelector((store) => store.admin.class.classes);
  const dispatch = useDispatch();
  useEffect(() => {
    if (classList.length === 0) {
      dispatch(fetchAllClasses());
    }
  }, []);
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Admission to Class</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Applying For</label>

          <select
            name="applyingClass"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.applyingClass}
            onChange={handleInputChange}
          >
            <option value="">Choose Options</option>
            {classList?.map((classItem, index) => (
              <option key={index} value={classItem?._id} className="py-2">
                {classItem.className}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">QID</label>
          <input
            type="text"
            name="Q_Id"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.Q_Id}
            onChange={handleInputChange}
          ></input>
        </div>
        <div>
          <label className="block text-gray-700">Transport Requirement</label>
          <select
            name="transportRequirement"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.transportRequirement}
            onChange={handleInputChange}
          >
            <option value={true}>YES</option>
            <option value={false}>NO</option>
          </select>
        </div>
        {/* <div>
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
        </div> */}
        {/* <div>
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
        </div> */}

        <div>
          <label className="block text-gray-700"> Enrollment Status</label>

          <select
            name="enrollmentStatus"
            value={studentInfo.enrollmentStatus}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="" disabled>
              Select
            </option>
            {[
              { value: "Full Time", label: "Full Time" },
              { value: "Part Time", label: "Part Time" },
            ].map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdmissionInfo;
