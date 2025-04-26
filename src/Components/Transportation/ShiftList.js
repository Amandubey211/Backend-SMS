import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllShifts } from "../../Store/Slices/Transportation/Shift/shift.action";
import { FaTrash, FaEdit } from "react-icons/fa"; // React Icons for Delete and Edit

const ShiftList = () => {
  const { shifts, loading, error } = useSelector(
    (store) => store?.transportation?.transportShift
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllShifts());
  }, [dispatch]);

  if (loading) {
    return <div className="p-4">Loading shifts...</div>;
  }

  return (
    <div className="p-5">
      {/* <h1 className="text-2xl font-bold mb-6 text-gray-800">Shift List</h1> */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-blue-50 text-gray-700 uppercase text-sm">
            <tr>
              <th className="py-3 px-6 text-left">S.No</th>
              <th className="py-3 px-6 text-left">Shift Name</th>
              <th className="py-3 px-6 text-left">From Time</th>
              <th className="py-3 px-6 text-left">To Time</th>
              <th className="py-3 px-6 text-left">Shift</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shifts?.map((shift, index) => (
              <tr
                key={shift._id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="py-4 px-6">{index + 1}</td>
                <td className="py-4 px-6">{shift.shiftName}</td>
                <td className="py-4 px-6">{shift.fromTime}</td>
                <td className="py-4 px-6">{shift.toTime}</td>
                <td className="py-4 px-6 capitalize">{shift.shift}</td>
                <td className="py-4 px-6">
                  <span
                    className={`text-sm font-semibold ${
                      shift.deactivateShift ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {shift.deactivateShift ? "Inactive" : "Active"}
                  </span>
                </td>
                <td className="py-4 px-6 flex items-center justify-center space-x-4">
                <button className="text-blue-500 hover:text-blue-700">
                    <FaEdit size={18} />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrash size={18} />
                  </button>
              
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftList;
