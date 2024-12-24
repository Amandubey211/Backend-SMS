import React, { useState } from "react";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { Menu, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { FiUserPlus } from "react-icons/fi";
import { ShareAltOutlined } from "@ant-design/icons";
import EmailModal from "../../../../Components/Common/EmailModal";
import { useNavigate } from 'react-router-dom';

// Sample Data
const data = [
    { id: "0098356", recipient: "Kameswaran S", class: "10", section: "B", paidDate: "16/12/24", amount: "1214 QAR", status: "Accepted" },
    { id: "0098357", recipient: "Kameswaran S", class: "10", section: "B", paidDate: "16/12/24", amount: "1214 QAR", status: "Rejected" },
    { id: "0098358", recipient: "Kameswaran S", class: "10", section: "B", paidDate: "16/12/24", amount: "1214 QAR", status: "Pending" },
    { id: "0098359", recipient: "Kameswaran S", class: "10", section: "B", paidDate: "16/12/24", amount: "1214 QAR", status: "Expired" },
];

const RecentReceiptsList = () => {
    const [isSortModalVisible, setSortModalVisible] = useState(false);
    const [isEmailModalOpen, setEmailModalOpen] = useState(false);

    const handleShareClick = () => {
        setEmailModalOpen(true);
    };

    const navigate = useNavigate();



    const closeEmailModal = () => {
        setEmailModalOpen(false);
    };

    // Dropdown Menu for Action
    const actionMenu = (
        <Menu>
            <Menu.Item key="1">View Details</Menu.Item>
            <Menu.Item key="2">Send Reminder</Menu.Item>
        </Menu>
    );

    // Status Badge Component
    const StatusBadge = ({ status }) => {
        const styles = {
            Accepted: { backgroundColor: "#DCFFE5", color: "#088728" },
            Rejected: { backgroundColor: "#FFE6E5", color: "#E70F00" },
            Pending: { backgroundColor: "#E9E7FF", color: "#3F2FF2" },
            Expired: { backgroundColor: "#D5D5D5", color: "#676767" },
        };
        return (
            <span className="px-3 py-2 rounded-lg text-sm font-semibold" style={styles[status] || { backgroundColor: "#E0E0E0", color: "#808080" }}>
                {status}
            </span>
        );
    };

    return (
        <AdminLayout>
            <div className="p-4 bg-white rounded-lg shadow-lg">
                {/* Header */}
                <h2 className="text-xl font-semibold">Recent Quotations List</h2>

                <div className="pt-1 bg-white">
                    {/* Filters and Buttons Section */}
                    <div className="flex justify-between items-start">
                        {/* Filters */}
                        <div className="pt-3 flex flex-col space-y-4">


                            {/* Radio Buttons Row */}
                            <div className="flex space-x-6">
                                <label className="flex items-center text-sm space-x-2">
                                    <input type="radio" name="studentFilter" className="form-radio text-green-600" defaultChecked />
                                    <span className="text-green-600 font-medium">All</span>
                                </label>
                                <label className="flex items-center text-sm space-x-2">
                                    <input type="radio" name="studentFilter" className="form-radio text-gray-500" />
                                    <span className="text-gray-700">Accepted</span>
                                </label>
                                <label className="flex items-center text-sm space-x-2">
                                    <input type="radio" name="studentFilter" className="form-radio text-gray-500" />
                                    <span className="text-gray-700">Rejected</span>
                                </label>
                                <label className="flex items-center text-sm space-x-2">
                                    <input type="radio" name="studentFilter" className="form-radio text-gray-500" />
                                    <span className="text-gray-700">Pending</span>
                                </label>
                                <label className="flex items-center text-sm space-x-2">
                                    <input type="radio" name="studentFilter" className="form-radio text-gray-500" />
                                    <span className="text-gray-700">Required</span>
                                </label>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center space-x-4">
                            <button className="flex items-center px-4 py-2 border rounded-lg text-gray-700 font-medium hover:shadow-md" onClick={() => setSortModalVisible(true)}>
                                Sort
                            </button>
                            <button
                                onClick={() => navigate("/finance/quotations/add-new-quotations")}
                                className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                            >
                                <span className="text-gray-800 font-medium">Add New Quotation</span>
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                                    <FiUserPlus size={16} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Receipts Table */}
                <div className="overflow-x-auto mt-6">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr style={{ backgroundColor: "#FFCEDB" }} className="text-left text-gray-800">
                                <th className="py-3 px-4 font-medium">Quotation Number</th>
                                <th className="py-3 px-4 font-medium">Quotation To</th>
                                <th className="py-3 px-4 font-medium">Purpose</th>
                                <th className="py-3 px-4 font-medium">Issue Date</th>
                                <th className="py-3 px-4 font-medium">Total Amount</th>
                                <th className="py-3 px-4 font-medium">Status</th>
                                <th className="py-3 px-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="py-4 px-4">{item.id}</td>
                                    <td className="py-4 px-4">{item.recipient}</td>
                                    <td className="py-4 px-4">{item.class}</td>
                                    <td className="py-4 px-4">{item.section}</td>
                                    <td className="py-4 px-4">{item.amount}</td>
                                    <td className="py-4 px-4">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="py-4 px-4 flex items-center gap-4">
                                        <Dropdown overlay={actionMenu} trigger={["click"]}>
                                            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
                                                <MoreOutlined style={{ fontSize: "16px", color: "#808080" }} />
                                            </button>
                                        </Dropdown>
                                        {/* <button onClick={handleShareClick} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
                                            <ShareAltOutlined style={{ fontSize: "16px", color: "purple" }} />
                                        </button> */}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
                    <span>Showing 10 Receipts of 4373</span>
                    <div className="flex gap-2">
                        <button className="text-gray-500">« Back</button>
                        <button className="bg-purple-500 text-white px-2 rounded">1</button>
                        <button className="text-gray-500">2</button>
                        <button className="text-gray-500">Next »</button>
                    </div>
                </div>
            </div>

            <EmailModal
                isOpen={isEmailModalOpen}
                onClose={closeEmailModal}
                sendButtonText="Send Receipt"
                onSubmit={() => {
                    console.log("Send Receipt Clicked");
                    closeEmailModal();
                }}
            />

        </AdminLayout>
    );
};

export default RecentReceiptsList;
