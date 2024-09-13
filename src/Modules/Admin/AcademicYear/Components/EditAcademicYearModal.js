import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../config/Common";

const EditAcademicYearModal = ({ show, onClose, year, refreshData }) => {
  const [updatedYear, setUpdatedYear] = useState({ ...year });
  const [loading, setLoading] = useState(false);
  const role = useSelector((store) => store.Auth.role);
  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(`${role}:token`);
      await axios.put(
        `${baseUrl}/admin/updateAcademicYear/${year._id}`,
        updatedYear,
        {
          headers: { Authentication: token },
        }
      );
      refreshData();
      onClose();
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Edit Academic Year</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Academic Year (YYYY-YYYY)
          </label>
          <input
            type="text"
            value={updatedYear.year}
            onChange={(e) =>
              setUpdatedYear({ ...updatedYear, year: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={formatDateForInput(updatedYear.startDate)}
            onChange={(e) =>
              setUpdatedYear({ ...updatedYear, startDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={formatDateForInput(updatedYear.endDate)}
            onChange={(e) =>
              setUpdatedYear({ ...updatedYear, endDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={updatedYear.isActive}
            onChange={(e) =>
              setUpdatedYear({ ...updatedYear, isActive: e.target.checked })
            }
            className="mr-2"
          />
          <label className="text-gray-700">Set as Active Year</label>
        </div>

        <button
          onClick={handleEditSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={onClose}
          className="ml-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditAcademicYearModal;
