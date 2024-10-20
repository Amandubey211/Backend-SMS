import React from "react";
import NoDataFound from "../../../Components/Common/NoDataFound";
import Spinner from "../../../Components/Common/Spinner";
import { GoAlertFill } from "react-icons/go";
import { useSelector } from "react-redux";
import { gt } from "../../../Utils/translator/translation";
import { useTranslation } from "react-i18next";

const FeeTable = ({ feesDetails }) => {
  const { loading, error } = useSelector((store) => store.student.studentFinance);
  const { t } = useTranslation();

  return (
    <div className="relative overflow-x-auto">
      <table className="min-w-full leading-normal" role="table">
        <thead className="bg-gray-100">
          <tr className="text-left text-gray-700" role="rowgroup">
            <th className="px-5 py-3 border-b-2 border-gray-200">{t("Fees Type", gt.stdFinance)}</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">{t("Paid By", gt.stdFinance)}</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">{t("Due Date", gt.stdFinance)}</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">{t("Amount", gt.stdFinance)}</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">{t("Status", gt.stdFinance)}</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {/* Display Loading Spinner */}
          {loading && (
            <tr>
              <td colSpan="5" className="text-center py-10">
                <Spinner />
              </td>
            </tr>
          )}

          {/* Display Error Message */}
          {/* {error && (
            <tr>
              <td colSpan="5" className="text-center py-10 text-red-600">
                <GoAlertFill className="inline-block w-12 h-12 mb-3" />
                <p className="text-lg font-semibold">{error}</p>
              </td>
            </tr>
          )} */}

          {/* Display No Data Found */}
          {(!loading && feesDetails?.length === 0) && (
            <tr>
              <td colSpan="5" className="text-center py-5">
                <NoDataFound />
              </td>
            </tr>
          )}

          {/* Display Fees Data */}
          {!loading  && feesDetails?.reverse()?.map((item, index) => (
            <tr key={index} className="text-left text-gray-700" role="row">
              <td className="px-5 py-2 border-b border-gray-200" role="cell">
                {item?.feeType}
              </td>
              <td className="px-5 py-2 border-b border-gray-200" role="cell">
                {item?.paidBy ? item?.paidBy : "-"}
              </td>
              <td className="px-5 py-2 border-b border-gray-200" role="cell">
                {item?.dueDate}
              </td>
              <td className="px-5 py-2 border-b border-gray-200" role="cell">
                {item?.amount}
              </td>
              <td className="px-5 py-2 border-b border-gray-200" role="cell">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full min-w-[75px] text-center ${item?.status === "Paid"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                    }`}
                >
                  {t(item?.status, gt.stdFinance)}
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
