import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { BsFillPatchCheckFill, BsPatchCheck } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const FinanceYearTable = ({
  FinancialYears,
  handleCheckboxChange,
  handleEdit,
}) => {
  const { t } = useTranslation("admFinanceYear");
  // Check if only one Finance year exists
  const isSingle = FinancialYears?.length === 1;

  return (
    <div className="bg-white p-2 rounded-lg w-full">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {t("All Financial Years")}
      </h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="text-left text-gray-500 text-base leading-normal bg-gray-100">
            <th className="p-3">{t("Year")}</th>
            <th className="p-3">{t("Start Date")}</th>
            <th className="p-3">{t("End Date")}</th>
            <th className="p-3">{t("Active")}</th>
            <th className="p-3">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody className="text-base text-gray-700">
          {FinancialYears?.map((year) => (
            <tr
              key={year._id}
              className={`${
                year.isActive
                  ? "bg-green-50 hover:bg-green-100"
                  : "hover:bg-gray-50"
              } border-b border-gray-200 transition duration-200`}
            >
              <td className="p-3">{year?.Name}</td>
              <td className="p-3">{year?.startDate?.slice(0, 10)}</td>
              <td className="p-3">{year?.endDate?.slice(0, 10)}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-md text-base ${
                    year.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {year.isActive ? t("Yes") : t("No")}
                </span>
              </td>
              <td className="p-3 flex items-center space-x-3 text-2xl">
                <button
                  onClick={() => handleEdit(year)}
                  className="text-purple-600 hover:text-purple-800 transition duration-150"
                >
                  <FaRegEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinanceYearTable;
