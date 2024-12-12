// src/Modules/Admin/Finance/StudentFees/Components/StudentFeesSummaryTable.js
import React, { useState } from "react";
import { Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const StudentFeesSummaryTable = () => {
  const [searchText, setSearchText] = useState("");

  const dataSource = [
    { key: "1", category: "Tuition", amount: "1500 QR", date: "2024-12-01" },
    { key: "2", category: "Hostel", amount: "2000 QR", date: "2024-12-02" },
    { key: "3", category: "Books", amount: "500 QR", date: "2024-12-03" },
  ];

  const columns = [
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Summary of Fees</h3>
      <Input
        placeholder="Search Fees"
        prefix={<SearchOutlined />}
        className="mb-4"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default StudentFeesSummaryTable;
