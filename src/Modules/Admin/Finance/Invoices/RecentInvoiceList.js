import React, { useState } from "react";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { Menu, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";

// Sample Data
const data = [
    { id: "0098356", recipient: "Kameswaran S", class: "10", section: "B", dueDate: "16/12/24", amount: "1214 QAR", status: "Returned" },
    { id: "0098357", recipient: "Kameswaran S", class: "10", section: "B", dueDate: "16/12/24", amount: "1214 QAR", status: "Canceled" },
    { id: "0098358", recipient: "Kameswaran S", class: "10", section: "B", dueDate: "16/12/24", amount: "1214 QAR", status: "-" },
];

const RecentInvoiceList = () => {
    const [hoveredRow, setHoveredRow] = useState(null);

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

    return (
        <AdminLayout>
            <div className="p-4 bg-white rounded-lg shadow-lg">
                {/* Header */}
                <h2 className="text-xl font-semibold mb-4">Recent Invoice List</h2>

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
