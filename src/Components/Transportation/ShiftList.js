import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteShift,
  getAllShifts,
  toggleShiftStatus,
} from "../../Store/Slices/Transportation/Shift/shift.action";
import { FaTrashAlt, FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";
import DeleteModal from "../Common/DeleteModal";

const ShiftList = ({ onEdit }) => {
  const { shifts, loading } = useSelector(
    (store) => store?.transportation?.transportShift
  );
  const dispatch = useDispatch();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  const handleDeleteShift = (shift) => {
    setSelectedShift(shift);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedShift) return;
    dispatch(deleteShift(selectedShift._id));
  };

  const handleToggleStatus = (shiftId, currentStatus) => {
    dispatch(toggleShiftStatus({ shiftId, deactivate: !currentStatus }));
  };

  useEffect(() => {
    dispatch(getAllShifts());
  }, [dispatch]);

  if (loading) {
    return <div className="p-6 text-center text-blue-500 font-semibold">Loading shifts...</div>;
  }

  return (
    <div className="p-6">
      <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-300 text-gray-700 uppercase text-sm">
            <tr>
              <th className="py-4 px-6 text-left">S.No</th>
              <th className="py-4 px-6 text-left">Shift Name</th>
              <th className="py-4 px-6 text-left">From Time</th>
              <th className="py-4 px-6 text-left">To Time</th>
              <th className="py-4 px-6 text-left">Shift</th>
              <th className="py-4 px-6 text-left">Status</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {shifts?.map((shift, index) => (
              <tr
                key={shift._id}
                className="border-b hover:bg-blue-50 transition duration-300"
              >
                <td className="py-4 px-6">{index + 1}</td>
                <td className="py-4 px-6 font-semibold">{shift.shiftName}</td>
                <td className="py-4 px-6">{shift.fromTime}</td>
                <td className="py-4 px-6">{shift.toTime}</td>
                <td className="py-4 px-6 capitalize">{shift.shift}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      shift.deactivateShift
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {shift.deactivateShift ? "Inactive" : "Active"}
                  </span>
                </td>
                <td className="py-4 px-6 flex items-center justify-center space-x-4">
                  {/* Edit */}
                  <button
                    onClick={() => onEdit(shift)}
                    className="text-blue-500 hover:text-blue-700 transition"
                    title="Edit Shift"
                  >
                    <FaEdit size={20} />
                  </button>

                  {/* Toggle Status */}
                  <button
                    onClick={() =>
                      handleToggleStatus(shift._id, shift.deactivateShift)
                    }
                    className={`${
                      shift.deactivateShift
                        ? "text-green-500 hover:text-green-700"
                        : "text-yellow-500 hover:text-yellow-700"
                    } transition`}
                    title={shift.deactivateShift ? "Activate Shift" : "Deactivate Shift"}
                  >
                    {shift.deactivateShift ? (
                      <FaToggleOn size={22} />
                    ) : (
                      <FaToggleOff size={22} />
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteShift(shift)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete Shift"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={selectedShift?.shiftName || "Shift"}
      />
    </div>
  );
};

export default ShiftList;
