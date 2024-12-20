import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import StatusBadge from "./StatusBadge";

const RecentQuotation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const data = [
    { id: "0098356", recipient: "Kameswaran S", class: "10", section: "B", totalAmount: "1214 QAR", status: "Paid" },
    { id: "0098357", recipient: "Kameswaran S", class: "10", section: "B", totalAmount: "1214 QAR", status: "Unpaid" },
    { id: "0098358", recipient: "Kameswaran S", class: "10", section: "B", totalAmount: "1214 QAR", status: "Partial" },
  ];

  // Filter data based on search query
  const filteredData = data.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.class.toString().includes(searchQuery) ||
      item.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.totalAmount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dropdown menu for actions
  const actionMenu = (
    <Menu>
      <Menu.Item key="1">View Details</Menu.Item>
      <Menu.Item key="2">Send Reminder</Menu.Item>
    </Menu>
  );

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Quotation List</h2>
        <div className="flex gap-4">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-[0.825rem] text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="border rounded-full pl-10 pr-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate("/finance/quotations/quotations-list")}
            className="text-purple-500 px-4 py-2 rounded-md border border-gray-400 shadow-md hover:shadow-xl hover:shadow-gray-300 transition duration-200"
          >
            View More
          </button>

        </div>
      </div>

      {/* Table Section */}
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
          {filteredData.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-4 px-4">{item.id}</td>
              <td className="py-4 px-4">{item.recipient}</td>
              <td className="py-4 px-4">{item.class}</td>
              <td className="py-4 px-4">{item.section}</td>
              <td className="py-4 px-4">{item.totalAmount}</td>
              <td className="py-4 px-4">
                <StatusBadge status={item.status} />
              </td>
              <td className="py-4 px-4">
                <Dropdown overlay={actionMenu} trigger={["click"]}>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                  >
                    <MoreOutlined style={{ fontSize: "16px", color: "#808080" }} />
                  </button>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentQuotation;
