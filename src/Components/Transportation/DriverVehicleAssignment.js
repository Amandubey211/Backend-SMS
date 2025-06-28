// Components/Transportation/DriverVehicleAssignment.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCalendarAlt,
  FaUserTie,
  FaUserFriends,
  FaCar,
  FaClock,
} from "react-icons/fa";
import { fetchDriverList } from "../../Store/Slices/Transportation/Driver/driver.action";
import { getAllShifts } from "../../Store/Slices/Transportation/Shift/shift.action";
import { getAllVehicles } from "../../Store/Slices/Transportation/Vehicles/vehicles.action";
import {
  createOrUpdateDriverVehicleAssignment,
  getDriverVehicleAssignments,
} from "../../Store/Slices/Transportation/vehicleDriverAssignment/vehicleDriverAssignment.action";
import { fetchHelperList } from "../../Store/Slices/Transportation/Helper/helper.action";
import toast from "react-hot-toast";

const DriverVehicleAssignment = ({ onSave, onClose, initialData, selectedAssignment }) => {
  const dispatch = useDispatch();

  // Redux states for drivers, shifts, and vehicles
  const { drivers, loading: driversLoading } = useSelector(
    (store) => store.transportation?.transportDriver
  );
  const { shifts, loading: shiftsLoading } = useSelector(
    (store) => store.transportation?.transportShift
  );
  const { vehicles, loading: vehiclesLoading } = useSelector(
    (store) => store.transportation?.transportVehicle
  );
  const { helpers } = useSelector(
    (store) => store.transportation?.transportHelper
  )

  // Form Data State
  const [formData, setFormData] = useState({
    vehicleId: null,
    shiftId: null,
    assigned_driver: null,
    assigned_helper: null,
    valid_from: new Date().toISOString().split("T")[0],
    valid_to: "",
    reason: "Regular Duty",
    is_active: true,
  });



  useEffect(() => {
    dispatch(fetchDriverList());
    dispatch(getAllShifts());
    dispatch(getAllVehicles());
    dispatch(fetchHelperList());
  }, [dispatch]);

  useEffect(() => {
    if (initialData && selectedAssignment) {
      // Edit mode - populate form
      setFormData({
        vehicleId: selectedAssignment?.vehicleId?._id || null,
        shiftId: selectedAssignment?.shiftId?._id || null,
        assigned_driver: selectedAssignment?.assigned_driver?._id || null,
        assigned_helper: selectedAssignment.assigned_helper?._id || null,
        valid_from: selectedAssignment.valid_from
          ? selectedAssignment.valid_from.split("T")[0]
          : new Date().toISOString().split("T")[0],
        valid_to: selectedAssignment.valid_to
          ? selectedAssignment.valid_to.split("T")[0]
          : "",
        reason: selectedAssignment.reason || "Regular Duty",
        is_active: selectedAssignment.is_active !== undefined ? selectedAssignment.is_active : true,
      });
    } else {
      // Add mode - clear form
      setFormData({
        vehicleId: null,
        shiftId: null,
        assigned_driver: null,
        assigned_helper: null,
        valid_from: new Date().toISOString().split("T")[0],
        valid_to: "",
        reason: "Regular Duty",
        is_active: true,
      });
    }
  }, [initialData, selectedAssignment]);



  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.valid_to &&
      new Date(formData.valid_to) < new Date(formData.valid_from)
    ) {
      alert("Valid To date should not be earlier than Valid From date.");
      return;
    }

    const dataToSubmit = {
      ...formData,
      date: new Date().toISOString(),
    };
    const createAssignment = async () => {

      const response = await dispatch(createOrUpdateDriverVehicleAssignment(dataToSubmit));
      if (response.payload.success) {
        toast.success("Assignment given successfully");
      }
      else {
        toast.error(response.payload.message || "Failed to give assignment");
      }
    }
    createAssignment()
    onClose()
  };

  if (driversLoading || shiftsLoading || vehiclesLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }



  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Vehicle Section */}
            <div className="bg-blue-50 p-3 rounded-md">
              <h3 className="flex items-center text-blue-800 font-medium mb-3">
                <FaCar className="mr-2" /> Vehicle Selection
              </h3>
              <select
                id="vehicleId"
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a vehicle</option>
                {vehicles?.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.vehicleNumber} (
                    {vehicle.vehicleType?.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Shift Section */}
            <div className="bg-green-50 p-3 rounded-md">
              <h3 className="flex items-center text-green-800 font-medium mb-3">
                <FaClock className="mr-2" /> Shift Information
              </h3>
              <select
                id="shiftId"
                name="shiftId"
                value={formData.shiftId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select a shift</option>
                {shifts?.map((shift) => (
                  <option key={shift._id} value={shift._id}>
                    {shift.shiftName} ({shift.fromTime}-{shift.toTime})
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Period */}
            <div className="bg-yellow-50 p-3 rounded-md">
              <h3 className="flex items-center text-yellow-800 font-medium mb-3">
                <FaCalendarAlt className="mr-2" /> Assignment Period
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <label
                    htmlFor="valid_from"
                    className="mb-1 text-sm font-medium text-gray-700"
                  >
                    Valid From
                  </label>
                  <input
                    type="date"
                    id="valid_from"
                    name="valid_from"
                    value={formData.valid_from}
                    onChange={handleChange}
                    required
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>

                {initialData && (
                  <div className="flex flex-col">
                    <label
                      htmlFor="valid_to"
                      className="mb-1 text-sm font-medium text-gray-700"
                    >
                      Valid To
                    </label>
                    <input
                      type="date"
                      id="valid_to"
                      name="valid_to"
                      value={formData.valid_to}
                      onChange={handleChange}
                      min={formData.valid_from}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Staff Assignment */}
            <div className="bg-purple-50 p-3 rounded-md">
              <h3 className="flex items-center text-purple-800 font-medium mb-3">
                <FaUserTie className="mr-2" /> Staff Assignment
              </h3>
              <select
                id="assigned_driver"
                name="assigned_driver"
                value={formData.assigned_driver}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select a driver</option>
                {drivers?.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.fullName} ({driver.driverBadgeNumber})
                  </option>
                ))}
              </select>

              <select
                id="assigned_helper"
                name="assigned_helper"
                value={formData.assigned_helper}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-3 focus:ring-purple-500 focus:border-purple-500"
                disabled={!formData.assigned_driver}
              >
                <option value="">Select a helper (optional)</option>
                {helpers?.map((helper) => (
                  <option key={helper._id} value={helper._id}>
                    {helper.fullName} ({helper.helperBadgeNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Details */}
            <div className="bg-red-50 p-3 rounded-md">
              <h3 className="flex items-center text-red-800 font-medium mb-3">
                <FaUserFriends className="mr-2" /> Assignment Details
              </h3>
              <input
                type="text"
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Reason for assignment"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600"
                />
                <label
                  htmlFor="is_active"
                  className="ml-2 text-sm text-gray-700"
                >
                  Active Assignment
                </label>
              </div>
            </div>
          </div>
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
            {initialData ? "Edit Assignment" : "Save Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverVehicleAssignment;
