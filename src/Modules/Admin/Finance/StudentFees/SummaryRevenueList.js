import React, { useState } from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";

const SummaryRevenueList = () => {
  const [dataSource, setDataSource] = useState([
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
            text === "Paid" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
            onClick={() => console.log("Edit", record)}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
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
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-lg px-4 py-2">
              <option value="Ten">Class: Ten</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-4 py-2">
              <option value="A">Section: A</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-4 py-2">
              <option value="Exam fees">Fees Type: Exam fees</option>
            </select>
            <div className="flex items-center space-x-2">
              <input type="radio" id="everyone" name="studentFilter" className="form-radio" defaultChecked />
              <label htmlFor="everyone" className="text-gray-700">Everyone</label>
              <input type="radio" id="paid" name="studentFilter" className="form-radio" />
              <label htmlFor="paid" className="text-gray-700">Paid Student</label>
              <input type="radio" id="unpaid" name="studentFilter" className="form-radio" />
              <label htmlFor="unpaid" className="text-gray-700">Unpaid Student</label>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="px-4 py-2 border-2 border-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-gray-700 hover:shadow-md"
            >
              Sort
            </button>
            <button
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90"
            >
              Export
            </button>
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