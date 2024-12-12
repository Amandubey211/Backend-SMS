// src/Modules/Admin/Finance/StudentFees/Components/StudentFeesSummaryTable.js
import React, { useState } from "react";
import { Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const StudentFeesSummaryTable = () => {
  const [searchText, setSearchText] = useState("");

  const dataSource = [
    { key: "1", category: "Tuition", amount: "1500 QR", date: "2024-12-01" },
    { key: "2", category: "Hostel", amount: "2000 QR", date: "2024-12-02" },
    { key: "3", category: "Books", amount: "500 QR", date: "2024-12-03" },
  ];

  // Handle search filtering
  const filteredData = dataSource.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
  ];

  return (
    <div className="w-full">
      {/* Heading and Search Box */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">Summary of Total Revenue</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Fees"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-300"
          />
          <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="key"
        />
      </div>
    </div>
  );
};

export default StudentFeesSummaryTable;
