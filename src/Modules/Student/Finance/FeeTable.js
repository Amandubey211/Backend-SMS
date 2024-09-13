import React from "react";
import NoDataFound from "../../../Components/Common/NoDataFound";
import Spinner from "../../../Components/Common/Spinner";
import { GoAlertFill } from "react-icons/go";
import { useSelector } from "react-redux";

const FeeTable = ({ feesDetails }) => {
  const { loading, error } = useSelector((store) => store.studentFinance);

  return (
    <div className="relative overflow-x-auto">
      <table className="min-w-full leading-normal" role="table">
        <thead className="bg-gray-100">
          <tr className="text-left text-gray-700" role="rowgroup">
            <th className="px-5 py-3 border-b-2 border-gray-200">Fees Type</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Paid By</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Due Date</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Amount</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>
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
          {error && (
            <tr>
              <td colSpan="5" className="text-center py-10 text-red-600">
                <GoAlertFill className="inline-block mb-2 w-12 h-12 mb-3" />
                <p className="text-lg font-semibold">{error}</p>
              </td>
            </tr>
          )}

          {/* Display No Data Found */}
          {!loading && !error && feesDetails?.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-5">
                <NoDataFound />
              </td>
            </tr>
          )}

          {/* Display Fees Data */}
          {!loading && !error && feesDetails?.reverse()?.map((item, index) => (
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
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    item?.status === "Paid"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {item?.status}
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
