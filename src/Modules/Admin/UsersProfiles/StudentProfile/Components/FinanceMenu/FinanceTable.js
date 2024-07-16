import React from "react";

const FinanceTable = ({ feesDetails }) => {
  return (
    <table className="min-w-full leading-normal">
      <thead>
        <tr className="text-left text-gray-700 bg-gray-100">
          <th className="px-5 py-3 border-b-2 border-gray-200">Fee Type</th>
          <th className="px-5 py-3 border-b-2 border-gray-200">Paid By</th>
          <th className="px-5 py-3 border-b-2 border-gray-200">Due Date</th>
          <th className="px-5 py-3 border-b-2 border-gray-200">Amount</th>
          <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>
          <th className="px-5 py-3 border-b-2 border-gray-200">Action</th>
        </tr>
      </thead>
      <tbody>
        {feesDetails?.map((item, index) => (
          <tr key={index} className="text-left text-gray-700">
            <td className="px-5 py-2 border-b border-gray-200">{item.feeType}</td>
            <td className="px-5 py-2 border-b border-gray-200">{item.paidBy}</td>
            <td className="px-5 py-2 border-b border-gray-200">{item.dueDate}</td>
            <td className="px-5 py-2 border-b border-gray-200">{item.amount} QR</td>
            <td className="px-5 py-2 border-b border-gray-200">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${item.status === "Paid" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                {item.status}
              </span>
            </td>
            <td className="px-5 py-2 border-b border-gray-200">
              {item.status === "Paid" ? (
                <span className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-green-200 text-green-800 py-1 px-2 rounded-md">
                  Complete
                </span>
              ) : (
                <button className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-1 px-2 rounded-md hover:from-pink-600 hover:to-purple-600">
                  Message
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FinanceTable;
