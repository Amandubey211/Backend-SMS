import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../../config/Common";
import EditAcademicYearModal from "./Components/EditAcademicYearModal";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { setAcademicYear } from "../../../Redux/Slices/Auth/AuthSlice";

// Helper function to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper function to format the academic year, including `isActive`
const formatAcademicYear = (academicYear, startDate, endDate, isActive) => {
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  return {
    academicYear,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    isActive,
  };
};

const MainSection = () => {
  const dispatch = useDispatch();
  const [academicYears, setAcademicYears] = useState([]);
  const [newYear, setNewYear] = useState({
    year: "",
    startDate: "",
    endDate: "",
    isActive: false,
  });
  const [editingYear, setEditingYear] = useState(null); // State for editing year
  const [deletingYear, setDeletingYear] = useState(null); // State for deleting year
  const [showEditModal, setShowEditModal] = useState(false); // State for showing edit modal
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for showing delete modal
  const [loading, setLoading] = useState(false);
  const role = useSelector((store) => store.Auth.role);

  // Fetch the academic years
  const fetchAcademicYears = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const { data } = await axios.get(`${baseUrl}/admin/getAllAcademicYear`, {
        headers: { Authentication: token },
      });
      if (data?.success) {
        const formattedYears = data.data.map((year) =>
          formatAcademicYear(
            year.year,
            year.startDate,
            year.endDate,
            year.isActive
          )
        );
        setAcademicYears(formattedYears);
        dispatch(setAcademicYear(formattedYears)); // Update Redux store with formatted data
      } else {
        toast.error(data.msg || "Failed to fetch academic years.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle academic year creation
  const handleCreate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const { data } = await axios.post(
        `${baseUrl}/admin/createAcademicYear`,
        newYear,
        {
          headers: { Authentication: token },
        }
      );
      if (data?.success) {
        const formattedNewYear = formatAcademicYear(
          data.data.year,
          data.data.startDate,
          data.data.endDate,
          data.data.isActive
        );
        setAcademicYears([...academicYears, formattedNewYear]);
        dispatch(setAcademicYear([...academicYears, formattedNewYear])); // Update Redux store with formatted data
        setNewYear({ year: "", startDate: "", endDate: "", isActive: false });
        toast.success("Academic year created successfully.");
      } else {
        toast.error(data.msg || "Failed to create academic year.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle academic year selection (set to Redux)
  const handleCheckboxChange = (year) => {
    dispatch(setAcademicYear(year));
    toast.success(`Selected academic year ${year.academicYear}`);
  };

  // Handle edit button click (opens edit modal)
  const handleEdit = (year) => {
    setEditingYear(year);
    setShowEditModal(true); // Show edit modal
  };

  // Handle delete button click (opens delete modal)
  const handleDelete = (year) => {
    setDeletingYear(year);
    setShowDeleteModal(true); // Show delete modal
  };

  // Handle deletion of an academic year
  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const { data } = await axios.delete(
        `${baseUrl}/admin/deleteAcademicYear/${deletingYear._id}`,
        {
          headers: { Authentication: token },
        }
      );
      if (data?.success) {
        setAcademicYears(
          academicYears.filter((year) => year._id !== deletingYear._id)
        );
        dispatch(
          setAcademicYear(
            academicYears.filter((year) => year._id !== deletingYear._id)
          )
        ); // Update Redux store with filtered data
        setShowDeleteModal(false);
        toast.success("Academic year deleted successfully.");
      } else {
        toast.error(data.msg || "Failed to delete academic year.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the academic years on component mount
  useEffect(() => {
    fetchAcademicYears();
  }, []);

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex">
      {/* List of Academic Years */}
      <div className="bg-white p-6 rounded-lg shadow-md w-2/3">
        <h2 className="text-2xl font-semibold mb-4">All Academic Years</h2>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Select</th>
              <th className="border p-2 text-left">Year</th>
              <th className="border p-2 text-left">Start Date</th>
              <th className="border p-2 text-left">End Date</th>
              <th className="border p-2 text-left">Active</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {academicYears.map((year) => (
              <tr key={year._id}>
                <td className="border p-2">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(year)}
                  />
                </td>
                <td className="border p-2">{year.academicYear}</td>
                <td className="border p-2">{year.startDate}</td>
                <td className="border p-2">{year.endDate}</td>
                <td className="border p-2">{year.isActive ? "Yes" : "No"}</td>
                <td className="border p-2 flex items-center space-x-4">
                  <button
                    onClick={() => handleEdit(year)}
                    className="text-blue-500 hover:underline"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(year)}
                    className="text-red-500 hover:underline"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Academic Year Form */}
      <div className="bg-white p-6 rounded-lg shadow-md w-1/3 ml-6 sticky top-10">
        <h2 className="text-2xl font-semibold mb-4">Create Academic Year</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Academic Year (YYYY-YYYY)
          </label>
          <input
            type="text"
            value={newYear.year}
            onChange={(e) => setNewYear({ ...newYear, year: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="2024-2025"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={newYear.startDate}
            onChange={(e) =>
              setNewYear({ ...newYear, startDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={newYear.endDate}
            onChange={(e) =>
              setNewYear({ ...newYear, endDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={newYear.isActive}
            onChange={(e) =>
              setNewYear({ ...newYear, isActive: e.target.checked })
            }
            className="mr-2"
          />
          <label className="text-gray-700">Set as Active Year</label>
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className={`w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition-all ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {loading ? "Creating..." : "Create Academic Year"}
        </button>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditAcademicYearModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          year={editingYear}
          refreshData={fetchAcademicYears}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingYear && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title={deletingYear.academicYear} // The academic year for confirmation
        />
      )}
    </div>
  );
};

export default MainSection;
