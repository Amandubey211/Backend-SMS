import React from "react";

const FeeTable = ({ feesDetails }) => {
  return (
    <table className="min-w-full leading-normal" role="table">
      <thead>
        <tr className="text-left text-gray-700 bg-gray-100" role="rowgroup">
          <th className="px-5 py-3 border-b-2 border-gray-200">Fees Type</th>
          <th className="px-5 py-3 border-b-2 border-gray-200">Paid By</th>
          <th className="px-5 py-3 border-b-2 border-gray-200">Due Date</th>
          <th className="px-5 py-3 border-b-2 border-gray-200">Amount</th>
          <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        {feesDetails.map((item, index) => (
          <tr key={index} className="text-left text-gray-700" role="row">
            <td className="px-5 py-2 border-b border-gray-200" role="cell">
              {item.feeType}
            </td>
            <td className="px-5 py-2 border-b border-gray-200" role="cell">
              {item.paidBy ? item.paidBy : "-----"}
            </td>
            <td className="px-5 py-2 border-b border-gray-200" role="cell">
              {item.dueDate}
            </td>
            <td className="px-5 py-2 border-b border-gray-200" role="cell">
              {item.amount}
            </td>
            <td className="px-5 py-2 border-b border-gray-200" role="cell">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  item.status === "Paid"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {item.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FeeTable;
