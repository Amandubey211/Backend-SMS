import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast"; // Import toast

const CreateAcademicYearForm = ({
  newYear,
  setNewYear,
  handleCreate,
  loading,
}) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    // Validate Academic Year format (YYYY-YYYY)
    const yearPattern = /^\d{4}-\d{4}$/;
    if (!newYear.year || !yearPattern.test(newYear.year)) {
      formErrors.year = "Academic Year must be in format 'YYYY-YYYY'.";
      toast.error("Invalid Academic Year format. Please enter 'YYYY-YYYY'.");
    }

    // Validate Start Date
    if (!newYear.startDate) {
      formErrors.startDate = "Start Date is required.";
      toast.error("Start Date is required.");
    }

    // Validate End Date
    if (!newYear.endDate) {
      formErrors.endDate = "End Date is required.";
      toast.error("End Date is required.");
    }

    // Ensure End Date is after Start Date
    if (
      newYear.startDate &&
      newYear.endDate &&
      newYear.endDate < newYear.startDate
    ) {
      formErrors.endDate = "End Date cannot be before Start Date.";
      toast.error("End Date cannot be before Start Date.");
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleCreate();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full border sticky top-2">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Create Academic Year
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Academic Year Input */}
        <div className="mb-2">
          <label className="block text-sm text-gray-700 font-medium mb-1">
            Academic Year (YYYY-YYYY)
          </label>
          <input
            type="text"
            value={newYear.year}
            onChange={(e) => setNewYear({ ...newYear, year: e.target.value })}
            className={`w-full px-3 py-2 border ${
              errors.year ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder="e.g., 2024-2025"
            required
          />
          {errors.year && (
            <p className="text-red-500 text-xs mt-1">{errors.year}</p>
          )}
        </div>

        {/* Start Date Input */}
        <div className="mb-2">
          <label className="block text-sm text-gray-700 font-medium mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={newYear.startDate}
            onChange={(e) =>
              setNewYear({ ...newYear, startDate: e.target.value })
            }
            className={`w-full px-3 py-2 border ${
              errors.startDate ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
            required
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
          )}
        </div>

        {/* End Date Input */}
        <div className="mb-2">
          <label className="block text-sm text-gray-700 font-medium mb-1">
            End Date
          </label>
          <input
            type="date"
            value={newYear.endDate}
            onChange={(e) =>
              setNewYear({ ...newYear, endDate: e.target.value })
            }
            className={`w-full px-3 py-2 border ${
              errors.endDate ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
            required
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
          )}
        </div>

        {/* Active Year Checkbox */}
        <div className="mb-3 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={newYear.isActive}
            onChange={(e) =>
              setNewYear({ ...newYear, isActive: e.target.checked })
            }
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          />
          <label className="text-sm text-gray-700">Set as Active Year</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition-all flex justify-center items-center ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> Creating...
            </>
          ) : (
            "Create Academic Year"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateAcademicYearForm;
