import React, { useState, useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { useDispatch } from "react-redux";
import { updateAcademicYear } from "../../../../Store/Slices/Common/AcademicYear/academicYear.action";
import { useTranslation } from "react-i18next"; // Import translation hook

// Helper function to format the date to YYYY-MM-DD
const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const EditAcademicYearModal = ({ show, onClose, year, refreshData }) => {
  const { t } = useTranslation("admAcademicYear"); // Use translation hook
  const [formData, setFormData] = useState({
    year: "",
    startDate: "",
    endDate: "",
    isActive: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    // Preload data when the modal is opened
    if (year && show) {
      setFormData({
        year: year.academicYear,
        startDate: formatDateForInput(year.startDate), // Format start date for input
        endDate: formatDateForInput(year.endDate), // Format end date for input
        isActive: year.isActive,
      });
    }
  }, [year, show]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (show) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [show, onClose]);

  // Validate the form
  const validateForm = () => {
    let formErrors = {};

    if (!formData.year) {
      formErrors.year = t("Academic Year is required.");
    }
    if (!formData.startDate) {
      formErrors.startDate = t("Start Date is required.");
    }
    if (!formData.endDate) {
      formErrors.endDate = t("End Date is required.");
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const dispatch = useDispatch();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    dispatch(updateAcademicYear({ data: formData, id: year?._id }));
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Blurred background */}
      <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

      {/* Modal */}
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl z-10 w-full max-w-lg mx-4 transition-transform transform duration-300 scale-95"
      >
        <div className="bg-gray-100 px-6 py-4 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("Edit Academic Year")}
          </h2>
        </div>
        <div className="bg-white p-5">
          <form onSubmit={handleSubmit}>
            {/* Academic Year */}
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                {t("Academic Year (YYYY-YYYY)")}
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className={`w-full px-3 py-2 border ${
                  errors.year ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
                placeholder={t("e.g., 2024-2025")}
                required
              />
              {errors.year && (
                <p className="text-red-500 text-xs mt-1">{errors.year}</p>
              )}
            </div>

            {/* Start Date */}
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                {t("Start Date")}
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className={`w-full px-3 py-2 border ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
                required
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.startDate}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                {t("End Date")}
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className={`w-full px-3 py-2 border ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
                required
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
            </div>

            {/* Active Year Checkbox */}
            <div className="mb-3 flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="mr-2 ms-1 w-4 h-4"
              />
              <label className="text-gray-700">
                {t("Set as Active Year")}
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={onClose}
                className="mr-3 bg-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300"
              >
                {t("Cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-all flex justify-center items-center ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> {t("Updating...")}
                  </>
                ) : (
                  t("Update Academic Year")
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAcademicYearModal;
