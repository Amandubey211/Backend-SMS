import React from "react";
import { useTranslation } from 'react-i18next';

const AllowedAttemptsSelect = ({ allowedAttempts, handleChange }) => {
  const { t } = useTranslation('admModule');

  return (
    <div className="mb-4">
      <label className="block text-gray-700">{t("Allowed Attempts")}</label>
      <select
        name="allowedAttempts"
        value={allowedAttempts ? "true" : "false"} // Handle boolean as string
        onChange={(e) =>
          handleChange({
            target: {
              name: "allowedAttempts",
              value: e.target.value === "true", // Convert to boolean
            },
          })
        }
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{t("Select")}</option>
        <option value="true">{t("Limited")}</option>
        <option value="false">{t("Unlimited")}</option>
      </select>
    </div>
  );
};

export default AllowedAttemptsSelect;
