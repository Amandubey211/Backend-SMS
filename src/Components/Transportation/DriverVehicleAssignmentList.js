import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaCar, FaUserTie } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getDriverVehicleAssignments } from "../../Store/Slices/Transportation/vehicleDriverAssignment/vehicleDriverAssignment.action";
import DeleteModal from "../Common/DeleteModal";

const DriverVehicleAssignmentList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const { loading, error, assignments } = useSelector(
    (store) => store?.transportation?.transportVDAssignment
  );

  useEffect(() => {
    dispatch(getDriverVehicleAssignments());
  }, [dispatch]);

  console.log("VDA", assignments);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* <div className="p-4 border-b">
        <h2 className="text-lg font-medium text-gray-800">
          Driver-Vehicle Assignments
        </h2>
        <p className="text-sm text-gray-600">
          Manage driver assignments to vehicles for different shifts
        </p>
      </div> */}

      {/* Assignment List */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading assignments...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            Error loading assignments!
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Vehicle",
                  "Driver / Helper",
                  "Shift",
                  "Duration",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <tr
                    key={assignment?._id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {/* Vehicle */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCar className="text-blue-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {assignment?.vehicleId?.vehicleNumber || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {assignment?.vehicleId?.vehicleType?.toUpperCase() ||
                              "Unknown"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Driver / Helper */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center mb-1">
                          <FaUserTie className="text-indigo-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {assignment?.assigned_driver?.fullName || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">Driver</div>
                          </div>
                        </div>
                        {assignment?.assigned_helper && (
                          <div className="flex items-center pl-1 border-l-2 border-gray-300 ml-1">
                            <FaUserTie className="text-purple-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {assignment?.assigned_helper?.fullName || "N/A"}
                              </div>
                              <div className="text-xs text-gray-500">
                                Helper
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Shift */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assignment?.shiftId?.shiftName || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {assignment?.shiftId?.fromTime} -{" "}
                        {assignment?.shiftId?.toTime}
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment?.valid_from
                          ? `${new Date(
                              assignment.valid_from
                            ).toLocaleDateString()}${
                              assignment.valid_to
                                ? ` - ${new Date(
                                    assignment.valid_to
                                  ).toLocaleDateString()}`
                                : ""
                            }`
                          : "N/A"}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          assignment?.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {assignment?.is_active ? "Active" : "Inactive"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onEdit(assignment)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        <FaEdit />
                      </button>
                      {/* <button className="text-red-600 hover:text-red-900">
                        <FaTrash />
                      </button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DriverVehicleAssignmentList;
