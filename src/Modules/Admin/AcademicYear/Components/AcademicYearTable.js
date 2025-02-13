import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { BsFillPatchCheckFill, BsPatchCheck } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { getAY } from "../../../../Utils/academivYear";

const AcademicYearTable = ({
  academicYears,
  handleCheckboxChange,
  handleEdit,
  handleDelete,
}) => {
  const { t } = useTranslation("admAcademicYear");
  const say = getAY();
  // Check if there is only one academic year
  const isSingle = academicYears?.length === 1;

  return (
    <div className="bg-white p-2 rounded-lg w-full">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {t("All Academic Years")}
      </h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="text-left text-gray-500 text-base leading-normal bg-gray-100">
            <th className="p-3">{t("Select")}</th>
            <th className="p-3">{t("Year")}</th>
            <th className="p-3">{t("Start Date")}</th>
            <th className="p-3">{t("End Date")}</th>
            <th className="p-3">{t("Active")}</th>
            <th className="p-3">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody className="text-base text-gray-700">
          {academicYears?.map((year) => (
            <tr
              key={year._id}
              className={`${
                say === year._id
                  ? "bg-green-50 hover:bg-green-100"
                  : "hover:bg-gray-50"
              } border-b border-gray-200 transition duration-200`}
            >
              <td className="p-3 flex justify-center">
                <button
                  onClick={() => handleCheckboxChange(year)}
                  disabled={isSingle} // Disable if only one academic year exists
                  className={`${
                    isSingle ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  {say === year._id ? (
                    <BsFillPatchCheckFill className="text-green-500 text-2xl" />
                  ) : (
                    <BsPatchCheck className="text-gray-400 text-2xl" />
                  )}
                </button>
              </td>
              <td className="p-3">{year?.year}</td>
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
                <button
                  onClick={() => handleDelete(year)}
                  className={`${
                    year.isActive
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-red-500 hover:text-red-700 transition duration-150"
                  }`}
                  disabled={year.isActive}
                >
                  <RiDeleteBin5Line />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AcademicYearTable;
