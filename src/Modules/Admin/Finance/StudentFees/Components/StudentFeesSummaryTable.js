// src/Modules/Admin/Finance/StudentFees/Components/StudentFeesSummaryTable.js

import React, { useEffect, useState, useMemo } from "react";
import { Table, Spin, Alert, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment"; // Replaced dayjs with moment
import { fetchAllStudentFees } from "../../../../../Store/Slices/Finance/StudentFees/studentFeesThunks";

const StudentFeesSummaryTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Adjust the selector path based on your Redux store structure
  const { fees, loading, error } = useSelector(
    (state) => state.admin.studentFees
  );

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchAllStudentFees({ page: 1, limit: 20 })); // Adjust params as needed
  }, [dispatch]);

  // Handle search filtering using useMemo for performance optimization
  const filteredData = useMemo(() => {
    if (!fees) return [];
    return fees.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }, [fees, searchText]);

  // Table columns definition
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => (a.category || "").localeCompare(b.category || ""),
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Amount",
      dataIndex: "final_amount",
      key: "final_amount",
      sorter: (a, b) => (a.final_amount || 0) - (b.final_amount || 0),
      render: (value) => (
        <span>{typeof value === "number" ? `${value} QR` : "N/A"}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "paidDate",
      key: "paidDate",
      sorter: (a, b) => new Date(a.paidDate) - new Date(b.paidDate),
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "N/A"), // Updated to use moment
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="link"
            onClick={() =>
              navigate(`/finance/studentfees/record/${record._id}`)
            } // Ensure this route exists
            className="text-blue-500"
          >
            View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Heading and Controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">
          Summary of Student Fees
        </h3>

        <div className="flex items-center space-x-4">
          {/* Search Box */}
          <Input
            placeholder="Search Fees"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            className="w-64"
            allowClear
          />

          {/* View More Button */}
          <Button
            type="primary"
            onClick={() => navigate("/finance/studentfees/total-revenue")}
            style={{
              borderImage: "linear-gradient(90deg, #C83B62, #46138A) 1",
              borderRadius: "8px",
            }}
          >
            View More
          </Button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center my-4">
          <Spin tip="Loading..." />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          className="my-4"
        />
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{ pageSize: 5 }}
            rowKey="_id" // Ensure each record has a unique _id
            bordered
          />
        </div>
      )}
    </div>
  );
};

export default StudentFeesSummaryTable;
