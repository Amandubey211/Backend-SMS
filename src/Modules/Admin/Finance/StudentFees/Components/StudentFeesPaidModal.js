import React from "react";
import PropTypes from "prop-types";

const StudentFeesPaidModal = ({ visible, onClose, onDownload, onSendInvoice, studentDetails, paymentDetails }) => {
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2"
            onClick={onClose} // Close modal when clicking outside
        >
            <div
                className="bg-white w-full max-w-xl rounded-lg shadow-lg overflow-auto"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Top red strip */}
                <div className="bg-[#C83B62] h-10 flex items-center px-4">
                    <h2 className="text-white font-medium text-md">Student Details</h2>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Student Details Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 mb-4 text-left text-sm">
                            <tbody>
                                {Object.entries(studentDetails).map(([key, value]) => (
                                    <tr key={key} className="border-b border-gray-200">
                                        <td className="px-3 py-1 font-medium text-gray-700 border-r border-gray-300 capitalize">
                                            {key.replace(/_/g, " ")}
                                        </td>
                                        <td className="px-3 py-1 text-gray-600">{value || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Total Amount */}
                    <div className="text-center mb-4">
                        <div className="border border-gray-300 p-3 rounded-lg font-medium text-sm">
                            Total Amount (after tax/discount/penalty) = <span className="font-bold">{studentDetails.total_amount || "N/A"}</span>
                        </div>
                    </div>

                    {/* Payment Details Section */}
                    <h3 className="text-pink-500 font-medium text-md mb-2">Payment Details</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-left text-sm">
                            <thead>
                                <tr className="bg-pink-100">
                                    {paymentDetails[0] && Object.keys(paymentDetails[0]).map((header) => (
                                        <th key={header} className="px-3 py-1 text-gray-700 font-medium capitalize border-r border-gray-300 last:border-r-0">
                                            {header.replace(/_/g, " ")}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paymentDetails.map((row, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        {Object.values(row).map((cell, idx) => (
                                            <td key={idx} className="px-3 py-1 text-gray-600 border-r border-gray-300 last:border-r-0">
                                                {cell || "N/A"}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between items-center mt-4 space-x-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-pink-500 text-pink-500 rounded-md hover:bg-pink-100 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onDownload}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#7F35CD] to-[#C83B62] text-white font-medium rounded-md hover:opacity-90 text-sm"
                        >
                            Download PDF
                        </button>
                        <button
                            onClick={onSendInvoice}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white font-medium rounded-md hover:opacity-90 text-sm"
                        >
                            Send Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

StudentFeesPaidModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
    onSendInvoice: PropTypes.func.isRequired,
    studentDetails: PropTypes.object.isRequired,
    paymentDetails: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default StudentFeesPaidModal;
