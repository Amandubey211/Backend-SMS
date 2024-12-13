import React from "react";
import PropTypes from "prop-types";

const StudentFeesUnpaidModal = ({ visible, onClose, onSendReminder, onDownloadPDF, studentDetails }) => {
    if (!visible) return null;

    const {
        name,
        class: studentClass,
        section,
        fees_type,
        due_date,
        total_amount,
        tax,
        discount,
        penalty,
        paid_status,
    } = studentDetails;

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
                                <tr className="border-b border-gray-200">
                                    <td className="px-3 py-1 font-medium text-gray-700 border-r border-gray-300">Name</td>
                                    <td className="px-3 py-1 text-gray-600">{name || "N/A"}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="px-3 py-1 font-medium text-gray-700 border-r border-gray-300">Class</td>
                                    <td className="px-3 py-1 text-gray-600">{studentClass || "N/A"}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="px-3 py-1 font-medium text-gray-700 border-r border-gray-300">Section</td>
                                    <td className="px-3 py-1 text-gray-600">{section || "N/A"}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="px-3 py-1 font-medium text-gray-700 border-r border-gray-300">Fees Type</td>
                                    <td className="px-3 py-1 text-gray-600">{fees_type || "N/A"}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="px-3 py-1 font-medium text-gray-700 border-r border-gray-300">Due Date</td>
                                    <td className="px-3 py-1 text-gray-600">{due_date || "N/A"}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="px-3 py-1 font-medium text-gray-700 border-r border-gray-300">Total Amount</td>
                                    <td className="px-3 py-1 text-gray-600">{total_amount || "N/A"} </td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="px-3 py-1 font-medium text-gray-700 border-r border-gray-300">Tax (inc/exc)</td>
                                    <td className="px-3 py-1 text-gray-600">{tax || "N/A"}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="px-3 py-1 font-medium text-gray-700 border-r border-gray-300">Discount</td>
                                    <td className="px-3 py-1 text-gray-600">{discount !== undefined ? `${discount}%` : "N/A"}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="px-3 py-1 font-medium text-gray-700 border-r border-gray-300">Penalty</td>
                                    <td className="px-3 py-1 text-gray-600">{penalty || "N/A"} </td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="px-3 py-1 font-medium text-gray-700 border-r border-gray-300">Paid Status</td>
                                    <td className="px-3 py-1 text-gray-600">
                                        <span className={`font-bold ${paid_status?.toLowerCase() === "paid" ? "text-green-500" : "text-red-500"}`}>
                                            {paid_status || "N/A"}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Total Amount Note */}
                    <div className="text-center mb-4">
                        <div className="border border-gray-300 p-3 rounded-lg font-medium text-sm text-gray-600">
                            <span className="font-bold text-gray-700">Total Amount (after tax/discount/penalty):</span>{" "}
                            {total_amount && penalty && discount && tax
                                ? (
                                      parseFloat(total_amount || 0) +
                                      parseFloat(penalty || 0) -
                                      parseFloat(discount || 0) +
                                      parseFloat(tax || 0)
                                  ).toFixed(2)
                                : "N/A"}{" "}
                            
                        </div>
                    </div>

                    {/* Download PDF Button */}
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={onDownloadPDF}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 text-sm"
                        >
                            Download PDF
                        </button>
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
                            onClick={onSendReminder}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white font-medium rounded-md hover:opacity-90 text-sm"
                        >
                            Send Reminder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

StudentFeesUnpaidModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSendReminder: PropTypes.func.isRequired,
    onDownloadPDF: PropTypes.func.isRequired,
    studentDetails: PropTypes.shape({
        name: PropTypes.string,
        class: PropTypes.string,
        section: PropTypes.string,
        fees_type: PropTypes.string,
        due_date: PropTypes.string,
        total_amount: PropTypes.string,
        tax: PropTypes.string,
        discount: PropTypes.string,
        penalty: PropTypes.string,
        paid_status: PropTypes.string,
    }).isRequired,
};

export default StudentFeesUnpaidModal;
