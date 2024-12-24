import React, { useState } from "react";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
// Sample Data
const data = [
    { id: "1234567896", recipient: "Kameswaran S", returnDate: "12/12/24", reason: "Incorrect Details", amount: "1200 QAR", refundStatus: "Paid" },
    { id: "1234567896", recipient: "Kameswaran S", returnDate: "12/12/24", reason: "Duplicate Invoice", amount: "1200 QAR", refundStatus: "Paid" },
    { id: "1234567896", recipient: "Kameswaran S", returnDate: "12/12/24", reason: "Service cancelled", amount: "1200 QAR", refundStatus: "Paid" },
    { id: "1234567896", recipient: "Kameswaran S", returnDate: "12/12/24", reason: "Duplicate Invoice", amount: "1200 QAR", refundStatus: "Paid" },
    { id: "1234567896", recipient: "Kameswaran S", returnDate: "12/12/24", reason: "Duplicate Invoice", amount: "1200 QAR", refundStatus: "Paid" },
    { id: "1234567896", recipient: "Kameswaran S", returnDate: "12/12/24", reason: "Duplicate Invoice", amount: "1200 QAR", refundStatus: "Paid" },
    { id: "1234567896", recipient: "Kameswaran S", returnDate: "12/12/24", reason: "Duplicate Invoice", amount: "1200 QAR", refundStatus: "Paid" },
    { id: "1234567896", recipient: "Kameswaran S", returnDate: "12/12/24", reason: "Duplicate Invoice", amount: "1200 QAR", refundStatus: "Paid" },
    { id: "1234567896", recipient: "Kameswaran S", returnDate: "12/12/24", reason: "Duplicate Invoice", amount: "1200 QAR", refundStatus: "Paid" },
    { id: "1234567896", recipient: "Kameswaran S", returnDate: "12/12/24", reason: "Duplicate Invoice", amount: "1200 QAR", refundStatus: "Paid" },
];

const ReturnInvoiceList = () => {
    const [hoveredRow, setHoveredRow] = useState(null);
    const [isSortModalVisible, setSortModalVisible] = useState(false);
    const navigate = useNavigate();
    // Status Badge Component
    const StatusBadge = ({ refundStatus }) => {
        return (
            <span
                className="px-4 py-2 rounded-md text-sm font-semibold"
                style={{ backgroundColor: "#DFFFE0", color: "#007F2C" }}
            >
                {refundStatus}
            </span>
        );
    };

    return (
        <AdminLayout>
            <div className="p-4 bg-white rounded-lg shadow-lg">
                {/* Header */}
                <h2 className="text-xl font-semibold">Return Invoice List</h2>
                <div className="p-6 bg-white  rounded-lg">
                    {/* Filters and Buttons Section */}
                    <div className="flex justify-between items-start">
                        {/* Left Side: Filters and Radio Buttons */}
                        <div className="flex flex-col space-y-4">
                            {/* Filters Row */}
                            <div className="flex items-center space-x-4">
                                {/* Class Filter */}
                                <div className="flex flex-col">
                                    <label className="text-gray-500 text-sm mb-1">Class</label>
                                    <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-28">
                                        <option value="Ten">Ten</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>

                                {/* Section Filter */}
                                <div className="flex flex-col">
                                    <label className="text-gray-500 text-sm mb-1">Section</label>
                                    <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-28">
                                        <option value="A">A</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>

                                {/* Fees Type Filter */}
                                <div className="flex flex-col">
                                    <label className="text-gray-500 text-sm mb-1">Fees Type</label>
                                    <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-36">
                                        <option value="Exam fees">Exam fees</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>
                            </div>

                            
                        </div>

                        {/* Right Side: Buttons */}
                        <div className="flex items-center space-x-4">
                            {/* Sort Button */}
                            <button
                                className="flex items-center px-4 py-2 border rounded-lg text-gray-700 font-medium hover:shadow-md"
                                style={{
                                    borderImage: "linear-gradient(to right, #FF007C, #8A2BE2) 1",
                                    borderRadius: "8px",
                                }}
                                onClick={() => setSortModalVisible(true)}
                            >
                                Sort
                                <span className="ml-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 17l-4 4m0 0l-4-4m4 4V3"
                                        />
                                    </svg>
                                </span>
                            </button>

                            

                            {/* Add New Fee Button */}
                            <button
                                onClick={() =>
                                    navigate("/finance/invoices/add-return-invoice")
                                }
                                className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                            >
                                <span className="text-gray-800 font-medium">Add Return Invoice</span>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                                    <FiUserPlus size={14} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Custom Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        {/* Table Header */}
                        <thead>
                            <tr
                                style={{ backgroundColor: "#FFCEDB" }}
                                className="text-left text-gray-800"
                            >
                                <th className="py-3 px-4 font-medium">Invoice ID</th>
                                <th className="py-3 px-4 font-medium">Recipient Name</th>
                                <th className="py-3 px-4 font-medium">Date of Return</th>
                                <th className="py-3 px-4 font-medium">Reason</th>
                                <th className="py-3 px-4 font-medium">Amount</th>
                                <th className="py-3 px-4 font-medium">Refund Status</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {data.map((item, index) => (
                                <tr
                                    key={index}
                                    onMouseEnter={() => setHoveredRow(index)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="py-4 px-4">{item.id}</td>
                                    <td className="py-4 px-4">{item.recipient}</td>
                                    <td className="py-4 px-4">{item.returnDate}</td>
                                    <td className="py-4 px-4">{item.reason}</td>
                                    <td className="py-4 px-4">{item.amount}</td>
                                    <td className="py-4 px-4">
                                        <StatusBadge refundStatus={item.refundStatus} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ReturnInvoiceList;
