import React, { useState } from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";



const SummaryRevenueList = () => {
  const [dataSource] = useState([
    {
      key: "1",
      name: "Leslie Alexander",
      class: "10",
      section: "B",
      feesType: "Exam",
      dueDate: "12/02/24",
      amount: "100 QAR",
      status: "Paid",
      penalty: "25 QAR",
    },
    {
      key: "2",
      name: "Leslie Alexander",
      class: "10",
      section: "B",
      feesType: "Exam",
      dueDate: "12/02/24",
      amount: "100 QAR",
      status: "Unpaid",
      penalty: "-",
    },
  ]);

  const navigate = useNavigate();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
    },
    {
      title: "Fees Type",
      dataIndex: "feesType",
      key: "feesType",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span
          className={`px-2 py-1 rounded-lg text-sm font-medium ${
            text === "Paid"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Penalty",
      dataIndex: "penalty",
      key: "penalty",
    },
    {
      title: "Invoice",
      key: "invoice",
      render: () => (
        <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-purple-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 8h6M9 12h6M9 16h6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex">
          <button
            className="w-1/2 py-2 text-center text-black bg-purple-100 hover:bg-purple-200"
            onClick={() => console.log("Edit", record)}
          >
            Edit
          </button>
          <button
            className="w-1/2 py-2 text-center text-red-600 bg-red-100 hover:bg-red-200"
            onClick={() => console.log("Delete", record)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  

  return (
    <AdminLayout>
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-6">
              <div className="flex flex-col">
                <label className="text-gray-500 text-sm mb-1">Class</label>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
                  <option value="Ten">Ten</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500 text-sm mb-1">Section</label>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
                  <option value="A">A</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500 text-sm mb-1">Fees Type</label>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
                  <option value="Exam fees">Exam fees</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-6">
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
                <input type="radio" name="studentFilter" className="form-radio text-gray-500" />
                <span className="text-gray-700">Paid Student</span>
              </label>
              <label className="flex items-center text-sm space-x-2">
                <input type="radio" name="studentFilter" className="form-radio text-gray-500" />
                <span className="text-gray-700">Unpaid Student</span>
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-4">
              {/* Sort Button */}
              <button className="flex items-center px-4 py-2 border-2 rounded-lg text-gray-700 font-medium hover:shadow-md"
                style={{
                  borderImageSource: "linear-gradient(to right, #FF007C, #8A2BE2)",
                  borderImageSlice: 1,
                }}
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
              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90">
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
            </div>

            <button
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg shadow hover:opacity-90"
              onClick={() => navigate("/finance/studentfees/add-fee")}
            >
              Add New Fee
            </button>
          </div>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="key"
          className="rounded-lg overflow-hidden"
        />
      </div>
    </AdminLayout>
  );
};

export default SummaryRevenueList;
