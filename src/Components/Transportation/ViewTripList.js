import React, { useState } from "react";
import {  FaClock, FaPlay, FaStop } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

const todayTrips = [
  {
    id: 1,
    route: "Route A",
    driver: "Ravi Kumar",
    busNumber: "UP32 AB 1234",
    startTime: "08:00 AM",
    endTime: "10:30 AM",
    status: "Completed",
    stops: ["Stop 1", "Stop 2", "Stop 3"],
  },
];

const historyTrips = [
  {
    id: 2,
    route: "Route B",
    driver: "Anjali Mehta",
    busNumber: "DL10 CD 5678",
    startTime: "09:00 AM",
    endTime: "11:15 AM",
    status: "Ongoing",
    stops: ["Stop 1", "Stop 2"],
  },
  {
    id: 3,
    route: "Route C",
    driver: "Sohan Lal",
    busNumber: "MH12 EF 9012",
    startTime: "07:30 AM",
    endTime: "09:45 AM",
    status: "Pending",
    stops: ["Stop 1", "Stop 2", "Stop 3", "Stop 4"],
  },
];

const statusColor = {
  Completed: "text-green-600",
  Ongoing: "text-yellow-600",
  Pending: "text-red-600",
};

const ViewTripsList = () => {
  const [activeTab, setActiveTab] = useState("today");

  const trips = activeTab === "today" ? todayTrips : historyTrips;

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "today"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("today")}
        >
          Today
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "history"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Route
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Driver
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Bus Number
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Timing
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Stops
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trips.map((trip) => (
              <tr key={trip.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm font-medium text-gray-900">
                  {trip.route}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {trip.driver}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {trip.busNumber}
                </td>

                {/* Updated Timing */}
                <td className="px-4 py-2 text-sm text-gray-700">
                  <div className="flex flex-col">
                    <div className="flex items-center text-green-600">
                      <FaClock className="mr-1" />
                      <span className="font-medium">Start:</span>&nbsp;
                      {trip.startTime}
                    </div>

                    {trip.status === "Completed" && (
                      <div className="flex items-center text-red-600 mt-1">
                        <FaClock className="mr-1" />
                        <span className="font-medium">End:</span>&nbsp;
                        {trip.endTime}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-4 py-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <MdLocationOn className="mr-1 text-red-500" />
                    {trip.stops.length} Stops
                  </div>
                </td>

                <td className="px-4 py-2 text-sm font-semibold">
                  <span className={`${statusColor[trip.status]}`}>
                    {trip.status}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="px-4 py-2 text-sm font-semibold">
                  <div className="flex space-x-3">
                    <button
                      title="Start Trip"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaPlay />
                    </button>
                    <button
                      title="End Trip"
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaStop />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {trips.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4 text-gray-500 text-sm"
                >
                  No trips found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewTripsList;
