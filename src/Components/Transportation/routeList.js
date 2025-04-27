import React, { useEffect, useState } from "react";
import { FaTrash, FaPen, FaChevronDown } from "react-icons/fa"; // Icons
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getRoutesBySchool } from "../../Store/Slices/Transportation/RoutesManagment/routes.action";

const RouteList = () => {
  const { loading, error, transportRoutes } = useSelector(
    (store) => store.transportation.transportRoute
  );
  const dispatch = useDispatch();

  const [openRoutes, setOpenRoutes] = useState({});

  const toggleRoute = (routeId) => {
    setOpenRoutes((prev) => ({
      ...prev,
      [routeId]: !prev[routeId],
    }));
  };


  useEffect(() => {
    dispatch(getRoutesBySchool());



  }, []);
  console.log(transportRoutes);

  return (
    <div className="p-4">
      {/* Add Route and Add SubRoute Buttons */}

      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-pink-100">
          <tr>
            <th className="p-2 text-left"></th> {/* Accordion Icon */}
            <th className="p-2 text-left">Route Name</th>
            <th className="p-2 text-left">Start Point</th>
            <th className="p-2 text-left">End Point</th>
            <th className="p-2 text-left">Stoppages</th> {/* 👈 New Column */}
            <th className="p-2 text-left">No.of Vehicles</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transportRoutes?.map((route) => (
            <React.Fragment key={route.routeId}>
              {/* Main Route Row */}
              <tr
                className="border-t border-gray-300 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleRoute(route.routeId)}
              >
                {/* Accordion Icon */}
                <td className="p-2">
                  <FaChevronDown
                    className={`transition-transform duration-300 ${
                      openRoutes[route.routeId] ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </td>
                <td className="p-2">{route.routeName}</td>
                <td className="p-2">{route?.stops[0]?.stopName}</td>
                <td className="p-2">
                  {route?.stops[route.stops.length - 1]?.stopName}
                </td>
                <td className="p-2">
                  {/* Clickable Stoppages */}
                  <Link
                    to={`/transportation/routes/${route.routeId}/stoppages`}
                    className="text-blue-500 underline"
                    onClick={(e) => e.stopPropagation()} // Prevent Accordion Toggle
                  >
                    {route.stops?.length} Stops
                  </Link>
                </td>
                <td className="p-2">{route.vehicles?.length}</td>
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
              {openRoutes[route.routeId] && (
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
                        {route?.vehicles?.map((vehicle) => (
                          <tr key={vehicle.id} className="border-t">
                            <td className="p-2">{vehicle.vehicleNumber}</td>
                            <td className="p-2">{vehicle.driverName}</td>
                            <td className="p-2">{route?.stops[0]?.stopName}</td>
                            <td className="p-2">
                              {route?.stops[route.stops.length - 1]?.stopName}
                            </td>
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