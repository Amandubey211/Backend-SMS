import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast"; // Import toast
import { useTranslation } from "react-i18next";

const CreateFinanceYearForm = ({
  newYear,
  setNewYear,
  handleCreate,
  loading,
}) => {
  const { t } = useTranslation("admFinanceYear"); 
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};
    if (!newYear.Name) {
      formErrors.Name = t("Finance Year required");
      toast.error(t("Finance Year required"));
    }

    // Validate Start Date
    if (!newYear.startDate) {
      formErrors.startDate = t("Start Date is required.");
      toast.error(t("Start Date is required."));
    }

    // Validate End Date
    if (!newYear.endDate) {
      formErrors.endDate = t("End Date is required.");
      toast.error(t("End Date is required."));
    }

    // Ensure End Date is after Start Date
    if (
      newYear.startDate &&
      newYear.endDate &&
      newYear.endDate < newYear.startDate
    ) {
      formErrors.endDate = t("End Date cannot be before Start Date.");
      toast.error(t("End Date cannot be before Start Date."));
    }

    setErrors(formErrors);
    return Object.keys(formErrors)?.length === 0;
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
        {t("Create Finance Year")}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Finance Year Input */}
        <div className="mb-2">
          <label className="block text-sm text-gray-700 font-medium mb-1">
            {t("Finance Year (FY-YYYY)")}
          </label>
          <input
            type="text"
            value={newYear.Name}
            onChange={(e) => setNewYear({ ...newYear, Name: e.target.value })}
            className={`w-full px-3 py-2 border ${
              errors.Name? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
            placeholder={t("e.g., FY-2000")}
            required
          />
          {errors.Name && (
            <p className="text-red-500 text-xs mt-1">{errors.Name}</p>
          )}
        </div>

      {/* Start Date Input */}
      <div className="mb-2">
        <label className="block text-sm text-gray-700 font-medium mb-1">
          {t("Start Date")}
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
          {t("End Date")}
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
          <label className="text-sm text-gray-700">
            {t("Set as Active Year")}
          </label>
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
              <FaSpinner className="animate-spin mr-2" /> {t("Creating...")}
            </>
          ) : (
            t("Create Finance Year")
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateFinanceYearForm;
