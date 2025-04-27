import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import { createShift, updateShift } from "../../Store/Slices/Transportation/Shift/shift.action";

const AddShift = ({ onSave, onClose, initialData, selectedShift }) => {
  const dispatch = useDispatch();
  console.log("selectedShift==>", selectedShift);

  // Form Data State
  const [formData, setFormData] = useState({
    shiftName: "",
    fromTime: "",
    toTime: "",
    shift: "",
    deactivateShift: false,
  });

  // UseEffect to populate form data when selected shift or initial data is available
  useEffect(() => {
    if (initialData && selectedShift) {
      setFormData({
        shiftName: selectedShift.shiftName || "",
        fromTime: selectedShift.fromTime || "",
        toTime: selectedShift.toTime || "",
        shift: selectedShift.shift || "",
        deactivateShift: selectedShift.deactivateShift || false,
      });
    }
  }, [initialData, selectedShift]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.fromTime &&
      new Date(formData.toTime) < new Date(formData.fromTime)
    ) {
      alert("ToTime date should not be earlier than  FromTime date.");
      return;
    }

    const dataToSubmit = {
      ...formData,
      date: new Date().toISOString(),
    };
    initialData ? dispatch(createShift(dataToSubmit)): dispatch(updateShift(dataToSubmit));
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-6">
          {/* Shift Name */}
          <div className="bg-blue-50 p-3 rounded-md">
            <h3 className="text-blue-800 font-medium mb-3">Shift Name</h3>
            <input
              type="text"
              id="shiftName"
              name="shiftName"
              value={formData.shiftName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Shift Name"
            />
          </div>
          {/* Shift Type */}
          <div className="bg-purple-50 p-3 rounded-md">
            <h3 className="text-purple-800 font-medium mb-3">Shift Type</h3>
            <select
              id="shift"
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select a shift type</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>

          {/* From Time */}
          <div className="bg-green-50 p-3 rounded-md">
            <h3 className="text-green-800 font-medium mb-3">From Time</h3>
            <input
              type="time"
              id="fromTime"
              name="fromTime"
              value={formData.fromTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* To Time */}
          <div className="bg-green-50 p-3 rounded-md">
            <h3 className="text-green-800 font-medium mb-3">To Time</h3>
            <input
              type="time"
              id="toTime"
              name="toTime"
              value={formData.toTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Deactivate Shift */}
          {/* {initialData && (
            <div className="bg-red-50 p-3 rounded-md">
              <h3 className="text-red-800 font-medium mb-3">
                Deactivate Shift
              </h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="deactivateShift"
                  name="deactivateShift"
                  checked={formData.deactivateShift}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600"
                />
                <label
                  htmlFor="deactivateShift"
                  className="ml-2 text-sm text-gray-700"
                >
                  Mark as Inactive
                </label>
              </div>
            </div>
          )} */}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {initialData ? "Edit Shift" : "Save Shift"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddShift;
