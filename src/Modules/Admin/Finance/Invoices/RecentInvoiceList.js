import React, { useState } from "react";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { Menu, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Invoice from "./Components/Invoice";
import { useRef, useEffect } from "react";

// Sample Data
const data = [
    { id: "0098356", recipient: "Kameswaran S", class: "10", section: "B", dueDate: "16/12/24", amount: "1214 QAR", status: "Returned" },
    { id: "0098357", recipient: "Kameswaran S", class: "10", section: "B", dueDate: "16/12/24", amount: "1214 QAR", status: "Canceled" },
    { id: "0098358", recipient: "Kameswaran S", class: "10", section: "B", dueDate: "16/12/24", amount: "1214 QAR", status: "-" },
];

const RecentInvoiceList = () => {
    const [hoveredRow, setHoveredRow] = useState(null);
    const [isSortModalVisible, setSortModalVisible] = useState(false);
    const [isInvoiceVisible, setInvoiceVisible] = useState(false); // Control popup visibility
    const popupRef = useRef(null); // Reference for the Invoice popup

    const navigate = useNavigate();

    // Dropdown Menu for Action
    const actionMenu = (
        <Menu>
            <Menu.Item key="1">Return</Menu.Item>
            <Menu.Item key="2">Cancel</Menu.Item>
        </Menu>
    );

    // Status Badge Component
    const StatusBadge = ({ status }) => {
        let style = {};
        if (status === "Returned") {
            style = { backgroundColor: "#F3EAFF", color: "#3F2FF2" };
        } else if (status === "Canceled") {
            style = { backgroundColor: "#FFE6E5", color: "#E70F00" };
        } else {
            style = { backgroundColor: "#E0E0E0", color: "#808080" };
        }
        return (
            <span className="px-4 py-2 rounded-md text-sm font-semibold" style={style}>
                {status}
            </span>
        );
    };

    // Render Action Button based on Status
    const ActionButton = ({ status }) => {
        if (status === "Canceled") {
            return (
                <button
                    className="px-5 py-2 rounded-lg text-base font-semibold border"
                    style={{ color: "#C83B62", borderColor: "#DCDCDC" }}
                >
                    Send Reminder
                </button>
            );
        }
        return (
            <button
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white"
                style={{
                    background: "linear-gradient(90deg, #C83B62 0%, #7F35CD 100%)",
                }}
            >
                Send Invoice
            </button>
        );
    };



    const openInvoice = () => {
        setInvoiceVisible(true); // Show Invoice popup
    };

    const closeInvoice = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
            setInvoiceVisible(false); // Close popup when clicking outside
        }
    };

    // Attach click outside listener
    useEffect(() => {
        document.addEventListener("mousedown", closeInvoice);
        return () => document.removeEventListener("mousedown", closeInvoice);
    }, []);

    return (
        <AdminLayout>
            <div className="p-4 bg-white rounded-lg shadow-lg">
                {/* Header */}
                <h2 className="text-xl font-semibold mb-4">Recent Invoice List</h2>

                <div className="p-6 bg-white shadow-lg rounded-lg">
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

                            {/* Radio Buttons Row */}
                            <div className="flex space-x-6">
                                <label className="flex items-center text-sm space-x-2">
                                    <input
                                        type="radio"
                                        name="studentFilter"
                                        className="form-radio text-green-600"
                                        defaultChecked
                                    />
                                    <span className="text-green-600 font-medium">Everyone</span>
                                </label>
                                <label className="flex items-center text-sm space-x-2">
                                    <input
                                        type="radio"
                                        name="studentFilter"
                                        className="form-radio text-gray-500"
                                    />
                                    <span className="text-gray-700">Paid Student</span>
                                </label>
                                <label className="flex items-center text-sm space-x-2">
                                    <input
                                        type="radio"
                                        name="studentFilter"
                                        className="form-radio text-gray-500"
                                    />
                                    <span className="text-gray-700">Unpaid Student</span>
                                </label>
                                <label className="flex items-center text-sm space-x-2">
                                    <input
                                        type="radio"
                                        name="studentFilter"
                                        className="form-radio text-gray-500"
                                    />
                                    <span className="text-gray-700">Overdue Student</span>
                                </label>
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

                            {/* Export Button */}
                            <button
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90"
                                onClick={() => console.log("Exporting data...")} // Implement export functionality
                            >
                                Export
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
                                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                                        />
                                    </svg>
                                </span>
                            </button>

                            {/* Add New Fee Button */}
                            <button
                                onClick={() =>
                                    navigate("/finance/studentfees/total-revenue/addFees")
                                }
                                className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                            >
                                <span className="text-gray-800 font-medium">Add New Invoice</span>
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                                    <FiUserPlus size={16} />
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
                            <tr style={{ backgroundColor: "#FFCEDB" }} className="text-left text-gray-800">
                                <th className="py-3 px-4 font-medium">Invoice ID</th>
                                <th className="py-3 px-4 font-medium">Recipient Name</th>
                                <th className="py-3 px-4 font-medium">Class</th>
                                <th className="py-3 px-4 font-medium">Section</th>
                                <th className="py-3 px-4 font-medium">Due Date</th>
                                <th className="py-3 px-4 font-medium">Amount</th>
                                <th className="py-3 px-4 font-medium">Status</th>
                                <th className="py-3 px-4 font-medium">Action</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {data.map((item, index) => (
                                <tr
                                    key={index}
                                    onClick={() => openInvoice()}
                                    onMouseEnter={() => setHoveredRow(index)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="py-4 px-4">{item.id}</td>
                                    <td className="py-4 px-4">{item.recipient}</td>
                                    <td className="py-4 px-4">{item.class}</td>
                                    <td className="py-4 px-4">{item.section}</td>
                                    <td className="py-4 px-4">{item.dueDate}</td>
                                    <td className="py-4 px-4">{item.amount}</td>
                                    <td className="py-4 px-4">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="py-4 px-4 flex items-center gap-4">
                                        <Dropdown overlay={actionMenu} trigger={["click"]}>
                                            <button
                                                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                                            >
                                                <MoreOutlined style={{ fontSize: "16px", color: "#808080" }} />
                                            </button>
                                        </Dropdown>
                                        <ActionButton status={item.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {isInvoiceVisible && (
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                        style={{ backdropFilter: "blur(5px)" }} // Dim and blur background
                    >
                        <div
                            ref={popupRef}
                            className="relative bg-white rounded-lg p-6 w-[700px] shadow-xl"
                        >
                            {/* Invoice Component */}
                            <Invoice />

                            {/* Close Button */}
                            <button
                                onClick={() => setInvoiceVisible(false)}
                                className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
                    <span>Showing 10 Student fees of 4373</span>
                    <div className="flex gap-2">
                        <button className="text-gray-500">« Back</button>
                        <button className="bg-purple-500 text-white px-2 rounded">1</button>
                        <button className="text-gray-500">2</button>
                        <button className="text-gray-500">3</button>
                        <button className="text-gray-500">Next »</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default RecentInvoiceList;
