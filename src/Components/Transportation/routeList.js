import React, { useState } from "react";
import { FaTrash, FaPen, FaChevronDown } from "react-icons/fa"; // Icons
import { Link } from "react-router-dom";

const RouteList = () => {
  const [openRoutes, setOpenRoutes] = useState({});

  const toggleRoute = (routeId) => {
    setOpenRoutes((prev) => ({
      ...prev,
      [routeId]: !prev[routeId],
    }));
  };

  const routes = [
    {
      id: 1,
      routeName: "Route 1",
      startPoint: "Point A",
      endPoint: "Point B",
      stoppages: 12, // 👈 New field
      vehicles: [
        {
          id: 101,
          vehicleNo: "Bus 102",
          driverName: "Kames",
          startPoint: "Point A",
          endPoint: "Point B",
          contact: "874462459",
          vehicleType: "Bus",
          students: "35/50",
        },
        {
          id: 102,
          vehicleNo: "Bus 103",
          driverName: "John",
          startPoint: "Point A",
          endPoint: "Point C",
          contact: "987654321",
          vehicleType: "Van",
          students: "20/30",
        },
      ],
      noOfVehicles: 2,
      totalStudents: 55,
    },
    {
      id: 2,
      routeName: "Route 2",
      startPoint: "Point X",
      endPoint: "Point Y",
      stoppages: 8, // 👈 New field
      vehicles: [
        {
          id: 201,
          vehicleNo: "Bus 202",
          driverName: "Steve",
          startPoint: "Point X",
          endPoint: "Point Y",
          contact: "7766554433",
          vehicleType: "Bus",
          students: "40/50",
        },
      ],
      noOfVehicles: 1,
      totalStudents: 40,
    },
  ];

  return (
    <div className="p-4">
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-pink-100">
          <tr>
            <th className="p-2 text-left"></th> {/* Accordion Icon */}
            <th className="p-2 text-left">Route Name</th>
            <th className="p-2 text-left">Start Point</th>
            <th className="p-2 text-left">End Point</th>
            <th className="p-2 text-left">Stoppages</th> {/* 👈 New Column */}
            <th className="p-2 text-left">No.of Vehicles</th>
            <th className="p-2 text-left">Total Students</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <React.Fragment key={route.id}>
              {/* Main Route Row */}
              <tr
                className="border-t border-gray-300 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleRoute(route.id)}
              >
                {/* Accordion Icon */}
                <td className="p-2">
                  <FaChevronDown
                    className={`transition-transform duration-300 ${
                      openRoutes[route.id] ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </td>
                <td className="p-2">{route.routeName}</td>
                <td className="p-2">{route.startPoint}</td>
                <td className="p-2">{route.endPoint}</td>
                <td className="p-2">
                  {/* Clickable Stoppages */}
                  <Link
                    to={`/routes/${route.id}/stoppages`}
                    className="text-blue-500 underline"
                    onClick={(e) => e.stopPropagation()} // Prevent Accordion Toggle
                  >
                    {route.stoppages} Stops
                  </Link>
                </td>
                <td className="p-2">{route.noOfVehicles}</td>
                <td className="p-2">{route.totalStudents}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <FaTrash
                      className="text-red-500 cursor-pointer"
                      size={18}
                    />
                    <FaPen className="text-blue-500 cursor-pointer" size={18} />
                  </div>
                </td>
              </tr>

              {/* Accordion Content */}
              {openRoutes[route.id] && (
                <tr>
                  <td colSpan="8" className="p-2 bg-gray-50">
                    <table className="w-full border mt-2">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="p-2 text-left">Vehicle</th>
                          <th className="p-2 text-left">Driver Name</th>
                          <th className="p-2 text-left">Start Point</th>
                          <th className="p-2 text-left">End Point</th>
                          <th className="p-2 text-left">Contact</th>
                          <th className="p-2 text-left">Vehicle Type</th>
                          <th className="p-2 text-left">Students</th>
                        </tr>
                      </thead>
                      <tbody>
                        {route.vehicles.map((vehicle) => (
                          <tr key={vehicle.id} className="border-t">
                            <td className="p-2">{vehicle.vehicleNo}</td>
                            <td className="p-2">{vehicle.driverName}</td>
                            <td className="p-2">{vehicle.startPoint}</td>
                            <td className="p-2">{vehicle.endPoint}</td>
                            <td className="p-2">{vehicle.contact}</td>
                            <td className="p-2">{vehicle.vehicleType}</td>
                            <td className="p-2">
                              {vehicle.students}{" "}
                              <a
                                href="#"
                                className="text-blue-500 underline ml-2"
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RouteList;
