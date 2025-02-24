import React from "react";
import NoDataFound from "../../../Components/Common/NoDataFound";
import Spinner from "../../../Components/Common/Spinner";
import { GoAlertFill } from "react-icons/go";
import { useSelector } from "react-redux";
import { gt } from "../../../Utils/translator/translation";
import { useTranslation } from "react-i18next";

const FeeTable = ({ feesDetails }) => {
  const { loading, error } = useSelector(
    (store) => store.student.studentFinance
  );
  const { t } = useTranslation();

  console.log("fee datils fee table", feesDetails);

  return (
    <div className="relative overflow-x-auto shadow-md rounded-lg  ">
      <table className="w-full border-collapse bg-white text-sm text-left text-gray-700">
        {/* Table Header */}
        <thead className="bg-gradient-to-r from-pink-500 to-purple-500 text-white sticky top-0 shadow-sm">
          <tr className="text-left text-sm font-semibold uppercase">
            <th className="px-6 py-4"> {t("Fees Type", gt.stdFinance)} </th>
            <th className="px-6 py-4"> {t("Paid By", gt.stdFinance)} </th>
            <th className="px-6 py-4"> {t("Due Date", gt.stdFinance)} </th>
            <th className="px-6 py-4"> {t("Amount", gt.stdFinance)} </th>
            <th className="px-6 py-4"> {t("Status", gt.stdFinance)} </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200">
          {/* Loading Spinner */}
          {loading && (
            <tr>
              <td colSpan="5" className="text-center py-10">
                <Spinner />
              </td>
            </tr>
          )}

          {/* No Data Found */}
          {!loading && feesDetails?.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-10">
                <NoDataFound title="No Fees Data" />
              </td>
            </tr>
          )}

          {/* Fees Data */}
          {!loading &&
            feesDetails
              ?.slice()
              .reverse()
              .map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-6 py-3 font-semibold text-gray-800">
                    {item?.subCategory}
                  </td>
                  <td className="px-6 py-3 font-semibold text-gray-800">
                    {item?.paidBy || "-"}
                  </td>
                  <td className="px-6 py-3 font-semibold text-gray-800">
                    {item?.dueDate || "NA"}
                  </td>
                  <td className="px-6 py-3 font-semibold text-gray-800">
                    ₹{item?.totalAmount}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full text-center w-20 
                      ${
                        item?.paymentStatus === "Paid"
                          ? "bg-green-200 text-green-800"
                          : item?.paymentStatus === "Partial"
                          ? "bg-orange-200 text-orange-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {t(item?.paymentStatus, gt.stdFinance)}
                    </span>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeeTable;
