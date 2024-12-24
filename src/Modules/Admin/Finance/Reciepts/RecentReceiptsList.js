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
    { id: "0098356", recipient: "Kameswaran S", class: "10", section: "B", paidDate: "16/12/24", amount: "1214 QAR", status: "Paid" },
    { id: "0098357", recipient: "Kameswaran S", class: "10", section: "B", paidDate: "16/12/24", amount: "1214 QAR", status: "Unpaid" },
    { id: "0098358", recipient: "Kameswaran S", class: "10", section: "B", paidDate: "16/12/24", amount: "1214 QAR", status: "Partial" },
    { id: "0098359", recipient: "Kameswaran S", class: "10", section: "B", paidDate: "16/12/24", amount: "1214 QAR", status: "Overdue" },
];

const RecentReceiptsList = () => {
    const [isSortModalVisible, setSortModalVisible] = useState(false);
    const [isEmailModalOpen, setEmailModalOpen] = useState(false);


    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/finance/receipts/add-new-receipt');
    };


    const handleShareClick = () => {
        setEmailModalOpen(true);
    };

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
            Paid: { backgroundColor: "#DCFFE5", color: "#088728" },
            Unpaid: { backgroundColor: "#FFE6E5", color: "#E70F00" },
            Partial: { backgroundColor: "#FFF0E3", color: "#FF6E0D" },
            Overdue: { backgroundColor: "#FFE6E5", color: "#E53935" },
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
                <h2 className="text-xl font-semibold mb-2">Recent Receipts List</h2>

                <div className="p-1 ">
                    {/* Filters and Buttons Section */}
                    <div className="flex justify-between items-start -mt-8">
                        {/* Filters */}
                        <div className="flex flex-col space-y-4">
                            <div className="mt-8 flex items-center space-x-4">
                                {/* Class Filter */}
                                <div className="flex flex-col">
                                    <label className="text-gray-500 text-sm mb-1">Class</label>
                                    <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-28">
                                        <option value="10">Ten</option>
                                    </select>
                                </div>

                                {/* Section Filter */}
                                <div className="flex flex-col">
                                    <label className="text-gray-500 text-sm mb-1">Section</label>
                                    <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-28">
                                        <option value="A">A</option>
                                    </select>
                                </div>

                                {/* Fees Type Filter */}
                                <div className="flex flex-col">
                                    <label className="text-gray-500 text-sm mb-1">Fees Type</label>
                                    <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-36">
                                        <option value="Exam Fees">Exam Fees</option>
                                    </select>
                                </div>
                            </div>

                            {/* Radio Buttons Row */}
                            <div className="flex space-x-6">
                                <label className="flex items-center text-sm space-x-2">
                                    <input type="radio" name="studentFilter" className="form-radio text-green-600" defaultChecked />
                                    <span className="text-green-600 font-medium">Everyone</span>
                                </label>
                                <label className="flex items-center text-sm space-x-2">
                                    <input type="radio" name="studentFilter" className="form-radio text-gray-500" />
                                    <span className="text-gray-700">Paid</span>
                                </label>
                                <label className="flex items-center text-sm space-x-2">
                                    <input type="radio" name="studentFilter" className="form-radio text-gray-500" />
                                    <span className="text-gray-700">Unpaid</span>
                                </label>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center space-x-4 mt-12">
                            <button className="flex items-center px-4 py-2 border rounded-lg text-gray-700 font-medium hover:shadow-md" onClick={() => setSortModalVisible(true)}>
                                Sort
                            </button>
                            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90">
                                Export
                            </button>
                            <button className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2" onClick={handleNavigate}>
                                <span className="text-gray-800 font-medium">Add New Receipt</span>
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
                                <th className="py-3 px-4 font-medium">Receipt ID</th>
                                <th className="py-3 px-4 font-medium">Recipient Name</th>
                                <th className="py-3 px-4 font-medium">Class</th>
                                <th className="py-3 px-4 font-medium">Section</th>
                                <th className="py-3 px-4 font-medium">Paid Date</th>
                                <th className="py-3 px-4 font-medium">Paid Amount</th>
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
                                    <td className="py-4 px-4">{item.paidDate}</td>
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
                                        <button onClick={handleShareClick} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
                                            <ShareAltOutlined style={{ fontSize: "16px", color: "purple" }} />
                                        </button>
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
